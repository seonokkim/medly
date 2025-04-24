import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ChatUserHistoriesEntity } from 'src/modules/chatUserHistories/entities/chatUserHistories.entity';

@Entity('chatBotHistories')
export class ChatBotHistoriesEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    comment: '사용자 쿼리에 대한 챗봇 답변 인덱스',
  })
  idx: number;

  @OneToOne(
    () => ChatUserHistoriesEntity,
    (chatUserHistory) => chatUserHistory.chatBotHistory,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'queryIdx' })
  chatUserHistory: ChatUserHistoriesEntity;

  @Column({
    type: 'text',
    comment: ' 챗봇 답변 문자열',
  })
  answer: string;

  @Column({
    type: 'text',
    comment: ' 챗봇 답변 문자열에 대한 인용문',
    nullable: true,
  })
  citation: string;

  @CreateDateColumn({
    name: 'createdAt',
    comment: '답변 생성일',
  })
  createdAt: Date;

  @DeleteDateColumn({
    name: 'deletedAt',
    comment: '답변 삭제일',
  })
  deletedAt: Date;
}
