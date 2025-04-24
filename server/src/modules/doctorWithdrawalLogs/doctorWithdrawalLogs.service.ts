import { Injectable } from '@nestjs/common';
import { CreateDoctorWithdrawalLogDto } from './dto/createDoctorWithdrawalLogs.dto';
import { UpdateDoctorWithdrawalLogDto } from './dto/updateDoctorWithdrawalLogs.dto';

@Injectable()
export class DoctorWithdrawalLogsService {
  create(createDoctorWithdrawalLogDto: CreateDoctorWithdrawalLogDto) {
    return 'This action adds a new doctorWithdrawalLog';
  }

  findAll() {
    return `This action returns all doctorWithdrawalLogs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} doctorWithdrawalLog`;
  }

  update(
    id: number,
    updateDoctorWithdrawalLogDto: UpdateDoctorWithdrawalLogDto,
  ) {
    return `This action updates a #${id} doctorWithdrawalLog`;
  }

  remove(id: number) {
    return `This action removes a #${id} doctorWithdrawalLog`;
  }
}
