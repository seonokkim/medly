import { Test, TestingModule } from '@nestjs/testing';
import { ChatUserHistoriesService } from './chatUserHistories.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ChatUserHistoriesEntity } from './entities/chatUserHistories.entity';
import { Repository } from 'typeorm';

// type MockChatUserHistoriesRepository<T = any> = Partial<
//   Record<keyof Repository<T>, jest.Mock>
// >;

describe('ChatUserHistoriesService', () => {
  let service: ChatUserHistoriesService;
  // let repository: MockChatUserHistoriesRepository<ChatUserHistoriesEntity>;

  const mockChatUserHistoriesService = {
    createOne: jest.fn(),
    findAllByDoctorIdx: jest.fn(),
    deleteOneByIdx: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ChatUserHistoriesService,
          useValue: mockChatUserHistoriesService,
        },
        {
          provide: getRepositoryToken(ChatUserHistoriesEntity),
          useValue: mockChatUserHistoriesService,
        },
      ],
    }).compile();

    service = module.get<ChatUserHistoriesService>(ChatUserHistoriesService);
    //   repository = module.get<
    //     MockChatUserHistoriesRepository<ChatUserHistoriesEntity>
    //   >(getRepositoryToken(ChatUserHistoriesEntity));
  });

  it('createOne()', async () => {
    const createOneChatUserHistoriesDto = {
      query: 'query',
      doctorIdx: 1,
    };

    const chatUser = {
      idx: 1,
      ...createOneChatUserHistoriesDto,
      createdAt: new Date(),
      deletedAt: new Date(),
    };
    mockChatUserHistoriesService.createOne.mockResolvedValue();
    const result = await service.createOne(createOneChatUserHistoriesDto);
    console.log(result);
    expect(result).toEqual(mockChatUserHistoriesService.createOne());
  });

  // it('findAllByDoctorIdx', async () => {
  //   const findAllByDoctorIdxChatUserHistoriesDto = {
  //     doctorIdx: 1,
  //   };
  //   await service.findAllByDoctorIdx(findAllByDoctorIdxChatUserHistoriesDto);

  // });

  // it('should be defined', () => {
  //   expect(chatUserHistoriesService).toBeDefined();
  // });
});
