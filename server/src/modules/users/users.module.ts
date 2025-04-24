import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersEntity } from './entity/users.entity';
import { UserWithdrawalLogsModule } from '../userWithdrawalLogs/userWithdrawalLogs.module';

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity]), UserWithdrawalLogsModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
