import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import * as fs from 'fs';
import axios from 'axios';
import * as FormData from 'form-data';
import { mkdir } from 'fs/promises';
import * as ffmpeg from 'fluent-ffmpeg';
import { join } from 'path';

import { UserRecordsEntity } from './entity/userRecords.entity';
import { handlingError } from '../../common/utils/handlingError';
import { GetPatientListReqQueryDto } from './dto/reqQuery.dto';
import { GetPatientListResDto } from './dto/resBody.dto';

interface SurgeryRecordContent {
  summary: string;
  detail: string;
}

@Injectable()
export class UserRecordsService {
  private readonly apiBaseUrl =
    'https://flask-api-a6f7c8azh4cgebb8.eastus2-01.azurewebsites.net';
  private readonly uploadDir = './uploads/voice-records';

  constructor(
    private dataSource: DataSource,
    @InjectRepository(UserRecordsEntity)
    private userRecordsRepo: Repository<UserRecordsEntity>,
  ) {
    // Ensure upload directory exists
    this.ensureUploadDirectory();
  }

  private async ensureUploadDirectory() {
    try {
      await mkdir(this.uploadDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create upload directory:', error);
    }
  }

  private async convertToWav(inputPath: string): Promise<string> {
    const outputPath = join(this.uploadDir, `${Date.now()}.wav`);

    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .toFormat('wav')
        .audioFrequency(16000)
        .audioChannels(1)
        .audioCodec('pcm_s16le')
        .on('error', (err) => {
          console.error('Error converting file to WAV:', err);
          reject(
            new HttpException(
              `Failed to convert audio file: ${err.message}`,
              HttpStatus.INTERNAL_SERVER_ERROR,
            ),
          );
        })
        .on('end', () => {
          // Remove the original file after conversion
          fs.unlink(inputPath, (err) => {
            if (err) console.error('Error removing original file:', err);
          });
          resolve(outputPath);
        })
        .save(outputPath);
    });
  }

  async addUserLog(
    userIdx: number,
    nameOfSurgery: string,
    surgeryRecord: string,
  ): Promise<UserRecordsEntity> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newUserLog = this.userRecordsRepo.create({
        nameOfSurgery,
        surgeryRecord,
        user: { idx: userIdx } as any,
      });

      const savedUserLog = await queryRunner.manager.save(newUserLog);
      await queryRunner.commitTransaction();
      return savedUserLog;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      handlingError(err);
    } finally {
      await queryRunner.release();
    }
  }

  async getPatientList(
    query?: GetPatientListReqQueryDto,
  ): Promise<GetPatientListResDto> {
    try {
      const queryBuilder = this.userRecordsRepo
        .createQueryBuilder('userRecords')
        .leftJoinAndSelect('userRecords.user', 'user')
        .where('user.deletedAt IS NULL')
        .andWhere('userRecords.deletedAt IS NULL');

      if (query?.name) {
        queryBuilder.andWhere('user.name LIKE :name', {
          name: `%${decodeURIComponent(query.name)}%`,
        });
      }
      if (query?.patientId) {
        queryBuilder.andWhere('user.patientId = :patientId', {
          patientId: query.patientId,
        });
      }

      queryBuilder.orderBy('userRecords.scheduledAt', 'DESC');

      const records = await queryBuilder.getMany();
      const patients = records.map((record) => ({
        idx: record.idx,
        name: record.user.name,
        patientId: record.user.patientId,
        dateOfBirth: record.user.dateOfBirth,
        scheduledAt: record.scheduledAt,
        status: record.status,
        nameOfSurgery: record.nameOfSurgery,
        surgeryRecord: record.surgeryRecord,
      }));

      return {
        patients,
        total: patients.length,
      };
    } catch (err) {
      handlingError(err);
    }
  }

  async processVoiceRecord(
    file: any,
    recordIdx: number,
  ): Promise<UserRecordsEntity> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let wavFile: string | null = null;

    try {
      console.log('[Step 1] Processing voice record');

      // First, find the existing record
      const existingRecord = await this.userRecordsRepo.findOne({
        where: { idx: recordIdx },
        relations: ['user'],
      });

      if (!existingRecord) {
        throw new HttpException('Record not found', HttpStatus.NOT_FOUND);
      }

      // Convert to WAV if not already in WAV format
      if (!file.mimetype.includes('wav')) {
        console.log('[Step 2] Converting file to WAV format');
        wavFile = await this.convertToWav(file.path);
      } else {
        console.log('[Step 2] File is already in WAV format');
        wavFile = file.path;
      }

      // 1. Upload the file to Azure Blob Storage
      console.log('[Step 3] Uploading file to Azure Blob Storage');
      const formData = new FormData();
      formData.append('file', fs.createReadStream(wavFile));

      const uploadResponse = await axios.post(
        `${this.apiBaseUrl}/upload`,
        formData,
        {
          headers: formData.getHeaders(),
        },
      );

      const blobName = uploadResponse.data.blob_name;
      const filePath = uploadResponse.data.file_url;
      console.log('[Step 3] File uploaded successfully:', uploadResponse.data);

      // 2. Convert to text using STT API
      console.log('[Step 4] Processing speech to text');
      const transcribeResponse = await axios.post(
        `${this.apiBaseUrl}/transcribe`,
        {
          blob_name: blobName,
        },
      );

      const textBlobName = transcribeResponse.data.text_blob_name;
      const transcribedText = transcribeResponse.data.stt_text;
      console.log('[Step 4] Speech to text completed:', {
        text_blob_name: textBlobName,
        text_length: transcribedText?.length || 0,
      });

      // 3. Get summary using Summarize API
      console.log('[Step 5] Generating summary');
      const summarizeResponse = await axios.post(
        `${this.apiBaseUrl}/summarize`,
        {
          text_blob_name: textBlobName,
        },
      );

      const summary = summarizeResponse.data.summary_text;
      console.log('[Step 5] Summary generated:', {
        summary_blob_name: summarizeResponse.data.summary_blob_name,
        summary_length: summary?.length || 0,
      });

      // 4. Update the existing record
      console.log('[Step 6] Updating record with processed data');
      const surgeryContent: SurgeryRecordContent = {
        summary,
        detail: transcribedText,
      };

      existingRecord.surgeryRecord = JSON.stringify(surgeryContent);
      existingRecord.filePath = filePath;
      const savedRecord = await queryRunner.manager.save(existingRecord);
      await queryRunner.commitTransaction();
      console.log('[Step 6] Record successfully updated:', {
        recordIdx: savedRecord.idx,
        contentLength: existingRecord.surgeryRecord.length,
      });

      // Clean up the temporary files
      if (wavFile && fs.existsSync(wavFile)) {
        fs.unlinkSync(wavFile);
      }

      return savedRecord;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      // Clean up the temporary files in case of error
      if (wavFile && fs.existsSync(wavFile)) {
        fs.unlinkSync(wavFile);
      }
      if (err.response) {
        // Handle API response errors specifically
        console.error('API Response Error:', {
          status: err.response.status,
          statusText: err.response.statusText,
          data: err.response.data,
        });
        throw new HttpException(
          err.response.data?.error || 'Failed to process voice record',
          err.response.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      handlingError(err);
    } finally {
      await queryRunner.release();
    }
  }

  async findOne(recordIdx: number): Promise<UserRecordsEntity> {
    try {
      const record = await this.userRecordsRepo.findOne({
        where: { idx: recordIdx },
        relations: ['user'],
      });

      if (!record) {
        throw new NotFoundException('Record not found');
      }

      return record;
    } catch (err) {
      handlingError(err);
    }
  }
}
