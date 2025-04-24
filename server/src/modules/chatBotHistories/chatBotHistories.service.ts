import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateOneChatBotHistoriesDto } from './dto/CreateOneChatBotHistories.dto';
import { ChatBotHistoriesEntity } from './entities/chatBotHistories.entity';
import { ChatUserHistoriesEntity } from '../chatUserHistories/entities/chatUserHistories.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DoctorsEntity } from '../doctors/entities/doctor.entity';
import { FindOneByQueryIdxChatBotHistoriesDto } from './dto/FindOneByQueryIdxChatBotHistories.dto';
import { FindAllByDoctorIdxChatBotHistoriesDto } from './dto/FindAllByDoctorIdxChatBotHistories.dto';
import { DeleteOneByIdxChatBotHistoriesDto } from './dto/DeleteOneByIdxChatBotHistories.dto';

@Injectable()
export class ChatBotHistoriesService {
  constructor(
    @InjectRepository(ChatUserHistoriesEntity)
    private chatUserHistoriesRepository: Repository<ChatUserHistoriesEntity>,
    @InjectRepository(ChatBotHistoriesEntity)
    private chatBotHistoriesRepository: Repository<ChatBotHistoriesEntity>,
  ) {}

  async createOne(
    createOneChatBotHistoriesDto: CreateOneChatBotHistoriesDto,
    doctorIdx: number,
  ) {
    const chatBot = new ChatBotHistoriesEntity();
    chatBot.answer = createOneChatBotHistoriesDto.answer;
    chatBot.citation = createOneChatBotHistoriesDto.citation;

    const chatUser = await this.chatUserHistoriesRepository.findOne({
      where: {
        idx: createOneChatBotHistoriesDto.queryIdx,
      },
      relations: {
        doctor: true,
      },
    });

    if (!chatUser) {
      throw new NotFoundException('ChatUserHistories not found');
    } else if (chatUser.doctor.idx !== +doctorIdx) {
      throw new UnauthorizedException('Unauthorized');
    }
    chatBot.chatUserHistory = chatUser;

    return this.chatBotHistoriesRepository.save(chatBot);
  }

  async findOneByQueryIdx(
    findOneByQueryIdxChatBotHistoriesDto: FindOneByQueryIdxChatBotHistoriesDto,
    doctorIdx: number,
  ): Promise<ChatBotHistoriesEntity> {
    const chatUser = await this.chatUserHistoriesRepository.findOne({
      where: {
        idx: findOneByQueryIdxChatBotHistoriesDto.queryIdx,
      },
      relations: {
        doctor: true,
      },
    });

    if (!chatUser) {
      throw new NotFoundException('ChatUserHistories not found');
    } else if (chatUser.doctor.idx !== +doctorIdx) {
      throw new UnauthorizedException('Unauthorized');
    }

    return this.chatBotHistoriesRepository.findOne({
      where: {
        chatUserHistory: { idx: chatUser.idx },
      },
    });
  }

  async findAllByDoctorIdx(
    findAllByDoctorIdxChatBotHistoriesDto: FindAllByDoctorIdxChatBotHistoriesDto,
  ): Promise<ChatBotHistoriesEntity[]> {
    const chatUser = new ChatUserHistoriesEntity();
    chatUser.doctor = new DoctorsEntity();
    chatUser.doctor.idx = findAllByDoctorIdxChatBotHistoriesDto.doctorIdx;

    return this.chatBotHistoriesRepository.find({
      where: {
        chatUserHistory: chatUser,
      },
    });
  }

  async deleteOneByIdx(
    deleteOneByIdxChatBotHistoriesDto: DeleteOneByIdxChatBotHistoriesDto,
    doctorIdx: number,
  ) {
    const chatBot = await this.chatBotHistoriesRepository.findOne({
      where: {
        idx: deleteOneByIdxChatBotHistoriesDto.idx,
      },
      relations: {
        chatUserHistory: {
          doctor: true,
        },
      },
    });

    if (chatBot.chatUserHistory.doctor.idx !== +doctorIdx) {
      throw new UnauthorizedException('Unauthorized');
    }

    const removed = await this.chatBotHistoriesRepository.softRemove(chatBot);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { chatUserHistory, ...result } = removed;
    return result;
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} chatBotHistory`;
  // }

  // update(id: number, updateChatBotHistoryDto: UpdateChatBotHistoryDto) {
  //   return `This action updates a #${id} chatBotHistory`;
  // }
}
