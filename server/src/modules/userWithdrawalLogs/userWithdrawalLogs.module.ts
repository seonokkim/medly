import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserWithdrawalLogsEntity } from './entity/userWithdrawalLogs.entity';
import { UserWithdrawalLogsController } from './userWithdrawalLogs.controller';
import { UserWithdrawalLogsService } from './userWithdrawalLogs.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserWithdrawalLogsEntity])],
  controllers: [UserWithdrawalLogsController],
  providers: [UserWithdrawalLogsService],
  exports: [UserWithdrawalLogsService],
})
export class UserWithdrawalLogsModule {}
