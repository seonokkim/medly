import { Module } from '@nestjs/common';
import { ChatsController } from './chats.controller';
import { ChatsService } from './chats.service';
import { ChatUserHistoriesModule } from '../chatUserHistories/chatUserHistories.module';
import { ChatBotHistoriesModule } from '../chatBotHistories/chatBotHistories.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [ChatUserHistoriesModule, ChatBotHistoriesModule, HttpModule],
  controllers: [ChatsController],
  providers: [ChatsService],
})
export class ChatsModule {}
