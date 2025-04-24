import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DoctorsEntity } from './entities/doctor.entity';
import { RegisterDto } from '../auth/dto/auth.dto';
import { handlingError } from '../../common/utils/handlingError';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(DoctorsEntity)
    private doctorsRepo: Repository<DoctorsEntity>,
  ) {}

  async create(registerDto: RegisterDto) {
    try {
      // 전화번호 중복 체크
      const existingDoctor = await this.findByPhone(registerDto.phone);
      if (existingDoctor) {
        throw new ConflictException('Phone number already exists');
      }

      const doctor = this.doctorsRepo.create(registerDto);
      return await this.doctorsRepo.save(doctor);
    } catch (err) {
      handlingError(err);
    }
  }

  async getAllDoctors() {
    try {
      return await this.doctorsRepo.find({
        where: {
          deletedAt: null,
        },
      });
    } catch (err) {
      handlingError(err);
    }
  }

  async findOne(idx: number) {
    try {
      const doctor = await this.doctorsRepo.findOne({
        where: {
          idx,
          deletedAt: null,
        },
      });

      if (!doctor) {
        throw new NotFoundException('Doctor not found');
      }

      return doctor;
    } catch (err) {
      handlingError(err);
    }
  }

  async findByPhone(phone: string) {
    try {
      return await this.doctorsRepo.findOne({
        where: {
          phone,
          deletedAt: null,
        },
      });
    } catch (err) {
      handlingError(err);
    }
  }

  async updateDoctor(idx: number, updateData: Partial<RegisterDto>) {
    try {
      const doctor = await this.findOne(idx);
      if (!doctor) {
        throw new NotFoundException('Doctor not found');
      }

      // 전화번호가 변경되는 경우 중복 체크
      if (updateData.phone && updateData.phone !== doctor.phone) {
        const existingDoctor = await this.findByPhone(updateData.phone);
        if (existingDoctor) {
          throw new ConflictException('Phone number already exists');
        }
      }

      Object.assign(doctor, updateData);
      return await this.doctorsRepo.save(doctor);
    } catch (err) {
      handlingError(err);
    }
  }

  async deleteDoctor(idx: number) {
    try {
      const doctor = await this.findOne(idx);
      if (!doctor) {
        throw new NotFoundException('Doctor not found');
      }

      doctor.deletedAt = new Date();
      return await this.doctorsRepo.save(doctor);
    } catch (err) {
      handlingError(err);
    }
  }
}
