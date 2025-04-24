import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ChatBotHistoriesEntity } from 'src/modules/chatBotHistories/entities/chatBotHistories.entity';
import { DoctorsEntity } from 'src/modules/doctors/entities/doctor.entity';

@Entity('chatUserHistories')
export class ChatUserHistoriesEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    comment: '사용자(의사) 쿼리 인덱스',
  })
  idx: number;

  @Column({
    type: 'text',
    comment: '사용자 쿼리 문자열',
  })
  query: string;

  @Column({
    type: 'varchar',
    comment: '챗봇 모델명',
    nullable: true,
  })
  model: string;

  @CreateDateColumn({
    name: 'createdAt',
    comment: '쿼리 생성일',
  })
  createdAt: Date;

  @DeleteDateColumn({
    name: 'deletedAt',
    comment: '쿼리 삭제일',
  })
  deletedAt: Date;

  @ManyToOne(() => DoctorsEntity, (doctor) => doctor.chatUserHistories)
  doctor: DoctorsEntity;

  @OneToOne(
    () => ChatBotHistoriesEntity,
    (chatBotHistory) => chatBotHistory.chatUserHistory,
    {
      cascade: true,
    },
  )
  chatBotHistory: ChatBotHistoriesEntity;
}
