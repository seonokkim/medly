import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UsersEntity } from './entity/users.entity';
import { handlingError } from 'src/common/utils/handlingError';
import { UserWithdrawalLogsService } from '../userWithdrawalLogs/userWithdrawalLogs.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private usersRepo: Repository<UsersEntity>,
    private userWithdrawalLogsService: UserWithdrawalLogsService,
  ) {}

  async getUserByPatientId(patientId: string) {
    try {
      const user = this.usersRepo
        .createQueryBuilder(`users`)
        .where(`users.uid = :uid`, { patientId })
        .andWhere(`users.deletedAt IS NULL`)
        .getRawOne();

      return user;
    } catch (err) {
      handlingError(err);
    }
  }

  async getUserRecordsByPatientId(patientId: number) {
    try {
      const queryBuilder = this.usersRepo
        .createQueryBuilder(`users`)
        .leftJoinAndSelect(`users.userRecords`, `userRecords`)
        .where(`users.patientId = :patientId`, {
          patientId,
        });

      /** @description 쿼리 조건식 추가할때 아래와 같이 사용 */
      queryBuilder.andWhere(`users.deletedAt IS NULL`);

      const userRecords = await queryBuilder.getRawMany();

      return { userRecords };
    } catch (err) {
      handlingError(err);
    }
  }

  async deleteUserByIdx(idx: number, reason: string) {
    const currentTime = new Date();

    try {
      const userWithdrawalLog =
        await this.userWithdrawalLogsService.addUserWithdrawalLogs(idx, reason);

      const deletedUser = await this.usersRepo.update(
        { idx },
        { deletedAt: currentTime },
      );

      return { userWithdrawalLog, deletedUser };
    } catch (error) {
      handlingError(error);
    }
  }
}
