import { Module } from '@nestjs/common';
import { DoctorWithdrawalLogsService } from './doctorWithdrawalLogs.service';
import { DoctorWithdrawalLogsController } from './doctorWithdrawalLogs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorWithdrawalLogsEntity } from './entities/doctorWithdrawalLogs.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DoctorWithdrawalLogsEntity])],
  controllers: [DoctorWithdrawalLogsController],
  providers: [DoctorWithdrawalLogsService],
})
export class DoctorWithdrawalLogsModule {}
