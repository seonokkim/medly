import {
  Body,
  Controller,
  Param,
  Post,
  Get,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { UserRecordsService } from './userRecords.service';
import { AddUserRecordBody } from './dto/reqBody.dto';
import { AddUserRecordParam } from './dto/reqParam.dto';
import { GetPatientListReqQueryDto } from './dto/reqQuery.dto';
import { GetPatientListResDto } from './dto/resBody.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('유저 수술 기록 API')
@Controller('userRecords')
@UseGuards(JwtAuthGuard)
export class UserRecordsController {
  constructor(private readonly userRecordsService: UserRecordsService) {}

  @Post('/addRecord/:userIdx')
  @ApiOperation({
    summary: '유저 수술 기록 생성 API',
    description: '유저 수술 기록 생성',
  })
  @ApiCreatedResponse({ description: 'DB 추가 성공' })
  @ApiInternalServerErrorResponse({
    description: '서버가 이해하지 못한 케이스',
  })
  async addUserLog(
    @Param() param: AddUserRecordParam,
    @Body() body: AddUserRecordBody,
  ) {
    const { userIdx } = param;
    const { nameOfSurgery, surgeryRecord } = body;

    return await this.userRecordsService.addUserLog(
      userIdx,
      nameOfSurgery,
      surgeryRecord,
    );
  }

  @Get()
  @ApiOperation({ summary: '환자 목록 조회' })
  @ApiResponse({
    status: 200,
    description: '환자 목록 조회 성공',
    type: GetPatientListResDto,
  })
  async getPatientList(
    @Query() query: GetPatientListReqQueryDto,
  ): Promise<GetPatientListResDto> {
    return this.userRecordsService.getPatientList(query);
  }

  @Post(':recordIdx/voice-record')
  @ApiOperation({
    summary: '음성 녹음 처리 API',
    description: '음성 녹음을 처리하고 기존 수술 기록에 저장',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/voice-records',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      limits: {
        fileSize: 1024 * 1024 * 50, // 50MB
      },
    }),
  )
  async processVoiceRecord(
    @Param('recordIdx') recordIdx: number,
    @UploadedFile() file: any,
  ) {
    if (!file) {
      throw new Error('No file uploaded');
    }
    return this.userRecordsService.processVoiceRecord(file, recordIdx);
  }

  @Get(':recordIdx')
  @ApiOperation({
    summary: '수술 기록 상세 조회 API',
    description: '특정 수술 기록의 상세 정보 조회',
  })
  @ApiResponse({
    status: 200,
    description: '수술 기록 조회 성공',
  })
  async getRecordDetail(@Param('recordIdx') recordIdx: number) {
    return this.userRecordsService.findOne(recordIdx);
  }
}
