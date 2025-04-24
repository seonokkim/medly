import { Test, TestingModule } from '@nestjs/testing';
import { ChatBotHistoriesController } from './chatBotHistories.controller';
import { ChatBotHistoriesService } from './chatBotHistories.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatBotHistoriesEntity } from './entities/chatBotHistories.entity';
import { ChatUserHistoriesEntity } from '../chatUserHistories/entities/chatUserHistories.entity';

describe('ChatBotHistoriesController', () => {
  let controller: ChatBotHistoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forFeature([
          ChatBotHistoriesEntity,
          ChatUserHistoriesEntity,
        ]),
      ],
      controllers: [ChatBotHistoriesController],
      providers: [ChatBotHistoriesService],
    }).compile();

    controller = module.get<ChatBotHistoriesController>(
      ChatBotHistoriesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
