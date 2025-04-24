import { PartialType } from '@nestjs/swagger';
import { CreateDoctorWithdrawalLogDto } from './createDoctorWithdrawalLogs.dto';

export class UpdateDoctorWithdrawalLogDto extends PartialType(
  CreateDoctorWithdrawalLogDto,
) {}
