import { Module } from '@nestjs/common';
import { ChatBotHistoriesService } from './chatBotHistories.service';
import { ChatBotHistoriesController } from './chatBotHistories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatBotHistoriesEntity } from './entities/chatBotHistories.entity';
import { ChatUserHistoriesEntity } from '../chatUserHistories/entities/chatUserHistories.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatBotHistoriesEntity, ChatUserHistoriesEntity]),
  ],
  controllers: [ChatBotHistoriesController],
  providers: [ChatBotHistoriesService],
  exports: [ChatBotHistoriesService],
})
export class ChatBotHistoriesModule {}
