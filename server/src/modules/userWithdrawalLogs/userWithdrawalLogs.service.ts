import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { UserWithdrawalLogsEntity } from './entity/userWithdrawalLogs.entity';
import { handlingError } from 'src/common/utils/handlingError';

@Injectable()
export class UserWithdrawalLogsService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(UserWithdrawalLogsEntity)
    private userWithdrawalLogsRepo: Repository<UserWithdrawalLogsEntity>,
  ) {}

  async addUserWithdrawalLogs(
    userIdx: number,
    reason: string,
  ): Promise<UserWithdrawalLogsEntity> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newUserWithdrawalLogs = new UserWithdrawalLogsEntity();
      newUserWithdrawalLogs.reason = reason;
      newUserWithdrawalLogs.user = { idx: userIdx } as any;
      const savedUserWithdrawalLogs = await queryRunner.manager.save(
        newUserWithdrawalLogs,
      );
      await queryRunner.commitTransaction();
      return savedUserWithdrawalLogs;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      handlingError(error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
