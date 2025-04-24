import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { UsersEntity } from 'src/modules/users/entity/users.entity';

@Entity('userWithdrawalLogs')
export class UserWithdrawalLogsEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    comment: '인덱스',
  })
  idx: number;

  @Column({
    type: 'varchar',
    comment: '회원 탈퇴 사유',
  })
  reason: string;

  @CreateDateColumn({
    name: 'createdAt',
    comment: '생성일',
  })
  createdAt: Date;

  @OneToOne(() => UsersEntity, (user) => user.userWithdrawalLog)
  @JoinColumn()
  user: UsersEntity;
}
