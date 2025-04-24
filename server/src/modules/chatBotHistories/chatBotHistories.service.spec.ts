import { Test, TestingModule } from '@nestjs/testing';
import { ChatBotHistoriesService } from './chatBotHistories.service';
import { ChatBotHistoriesEntity } from './entities/chatBotHistories.entity';
import { Repository } from 'typeorm';
import { CreateOneChatBotHistoriesDto } from './dto/CreateOneChatBotHistories.dto';

describe('ChatBotHistoriesService', () => {
  let service: ChatBotHistoriesService;
  let repository: Repository<ChatBotHistoriesEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ChatBotHistoriesService,
          useValue: repository,
        },
      ],
    }).compile();

    service = module.get<ChatBotHistoriesService>(ChatBotHistoriesService);
  });

  it('should be defined', () => {
    const createOneChatBotHistoriesDto = new CreateOneChatBotHistoriesDto();
    createOneChatBotHistoriesDto.answer = 'answer';
    createOneChatBotHistoriesDto.queryIdx = 1;

    expect(service.createOne(createOneChatBotHistoriesDto)).toBeInstanceOf(
      ChatBotHistoriesEntity,
    );
  });
});
