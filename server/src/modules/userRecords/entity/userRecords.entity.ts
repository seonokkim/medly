import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { UsersEntity } from 'src/modules/users/entity/users.entity';

@Entity('userRecords')
export class UserRecordsEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    comment: '인덱스',
  })
  idx: number;

  @Column({
    type: 'varchar',
    comment: '수술 명',
  })
  nameOfSurgery: string;

  @Column({
    type: 'text',
    comment: '수술 상세 기록 내용',
  })
  surgeryRecord: string;

  @Column({
    type: 'varchar',
    comment: '수술 동의서 문서 등 서버 내 파일 저장 경로',
    nullable: true,
  })
  filePath: string;

  @Column({
    type: 'boolean',
    comment: '0:설명 필요, 1:설명 완료',
    nullable: true,
  })
  status: boolean;

  @Column({
    type: 'datetime',
    comment: '수술 예정 시일',
    nullable: true,
  })
  scheduledAt: Date;

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

  @ManyToOne(() => UsersEntity, (user) => user.userRecords)
  user: UsersEntity;
}
