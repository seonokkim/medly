import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { DoctorsEntity } from 'src/modules/doctors/entities/doctor.entity';

@Entity('doctorWithdrawalLogs')
export class DoctorWithdrawalLogsEntity {
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

  @OneToOne(() => DoctorsEntity, (doctor) => doctor.doctorWithdrawalLog)
  @JoinColumn()
  doctor: DoctorsEntity;
}
