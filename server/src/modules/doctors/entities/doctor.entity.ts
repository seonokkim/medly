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
import { Exclude } from 'class-transformer';

import { ChatUserHistoriesEntity } from '../../chatUserHistories/entities/chatUserHistories.entity';
import { DoctorWithdrawalLogsEntity } from '../../doctorWithdrawalLogs/entities/doctorWithdrawalLogs.entity';

@Entity('doctors')
export class DoctorsEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    comment: '의사 인덱스',
  })
  idx: number;

  @Column({
    type: 'varchar',
    comment: '의사 직급 또는 직책',
  })
  role: string;

  @Column({
    type: 'varchar',
    comment: '의사 이메일',
  })
  email: string;

  @Column({
    type: 'varchar',
    comment: '의사 성명',
  })
  name: string;

  @Column({
    type: 'varchar',
    comment: '의사 계정 암호',
  })
  @Exclude()
  password: string;

  @Column({
    type: 'varchar',
    comment: '의사 휴대전화 번호',
  })
  phone: string;

  @CreateDateColumn({
    name: 'dateOfBirth',
    comment: '의사 생년월일',
  })
  dateOfBirth: Date;

  @Column({
    type: 'varchar',
    comment: '의사 성별',
  })
  gender: 'male' | 'female';

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

  @OneToMany(
    () => ChatUserHistoriesEntity,
    (chatUserHistory) => chatUserHistory.doctor,
  )
  chatUserHistories: ChatUserHistoriesEntity[];

  @OneToOne(
    () => DoctorWithdrawalLogsEntity,
    (doctorWithdrawalLog) => doctorWithdrawalLog.doctor,
  )
  doctorWithdrawalLog: DoctorWithdrawalLogsEntity;
}
