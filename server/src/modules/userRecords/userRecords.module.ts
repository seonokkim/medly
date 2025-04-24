import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserRecordsController } from './userRecords.controller';
import { UserRecordsService } from './userRecords.service';
import { UserRecordsEntity } from './entity/userRecords.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserRecordsEntity])],
  controllers: [UserRecordsController],
  providers: [UserRecordsService],
})
export class UserRecordsModule {}
