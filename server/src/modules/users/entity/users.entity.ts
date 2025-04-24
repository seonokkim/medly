import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { UserRecordsEntity } from 'src/modules/userRecords/entity/userRecords.entity';
import { UserWithdrawalLogsEntity } from 'src/modules/userWithdrawalLogs/entity/userWithdrawalLogs.entity';

@Entity('users')
export class UsersEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    comment: '환자 인덱스',
  })
  idx: number;

  @Column({
    type: 'varchar',
    comment: '환자 ID',
  })
  patientId: string;

  @Column({
    type: 'varchar',
    comment: '환자 성명',
  })
  name: string;

  @Column({
    type: 'varchar',
    comment: '환자 성별',
  })
  gender: 'male' | 'female';

  @CreateDateColumn({
    name: 'dateOfBirth',
    comment: '환자 생년월일',
  })
  dateOfBirth: Date;

  @Column({
    type: 'varchar',
    comment: '환자 이메일',
  })
  email: string;

  @Column({
    type: 'varchar',
    comment: '환자 휴대전화 번호',
  })
  phone: string;

  @Column({
    type: 'varchar',
    comment: '환자 특이사항란',
    nullable: true,
  })
  significant: string;

  @Column({
    type: 'varchar',
    comment: '환자 특이사항 외 비고',
    nullable: true,
  })
  note: string;

  @CreateDateColumn({
    name: 'createdAt',
    comment: '생성일',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updatedAt',
    comment: '수정일',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deletedAt',
    nullable: true,
    comment: '삭제일',
  })
  deletedAt: Date;

  @OneToMany(() => UserRecordsEntity, (userRecords) => userRecords.user)
  userRecords: UserRecordsEntity[];

  @OneToOne(
    () => UserWithdrawalLogsEntity,
    (userWithdrawalLog) => userWithdrawalLog.user,
  )
  userWithdrawalLog: UserWithdrawalLogsEntity;
}
