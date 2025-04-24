import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateOneChatUserHistoriesDto } from './dto/CreateOneChatUserHistories.dto';
import { ChatUserHistoriesEntity } from './entities/chatUserHistories.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DoctorsEntity } from '../doctors/entities/doctor.entity';
import { FindAllByDoctorIdxChatUserHistoriesDto } from './dto/FindAllByDoctorIdxChatUserHistories.dto';
import { DeleteOneChatUserHistoriesDto } from './dto/DeleteOneChatUserHistories.dto';

@Injectable()
export class ChatUserHistoriesService {
  constructor(
    @InjectRepository(ChatUserHistoriesEntity)
    private chatUserHistoriesRepository: Repository<ChatUserHistoriesEntity>,
  ) {}

  async createOne(
    createOneChatUserHistoriesDto: CreateOneChatUserHistoriesDto,
  ) {
    const chatUser = new ChatUserHistoriesEntity();
    chatUser.query = createOneChatUserHistoriesDto.query;
    chatUser.model = createOneChatUserHistoriesDto.model;
    chatUser.doctor = new DoctorsEntity();
    chatUser.doctor.idx = createOneChatUserHistoriesDto.doctorIdx;
    return this.chatUserHistoriesRepository.save(chatUser);
  }

  async findAllByDoctorIdx(
    findAllByDoctorIdxChatUserHistoriesDto: FindAllByDoctorIdxChatUserHistoriesDto,
  ): Promise<ChatUserHistoriesEntity[]> {
    const doctor = new DoctorsEntity();
    doctor.idx = findAllByDoctorIdxChatUserHistoriesDto.doctorIdx;
    return this.chatUserHistoriesRepository.find({
      where: {
        doctor: doctor,
      },
    });
  }

  async deleteOneByIdx(
    deleteOneChatUserHistoriesDto: DeleteOneChatUserHistoriesDto,
    doctorIdx: number,
  ) {
    const chatUser = await this.chatUserHistoriesRepository.findOne({
      where: {
        idx: deleteOneChatUserHistoriesDto.idx,
      },
      relations: {
        chatBotHistory: true,
      },
    });

    if (chatUser.doctor.idx !== +doctorIdx) {
      throw new UnauthorizedException('Unauthorized');
    }

    return this.chatUserHistoriesRepository.softRemove(chatUser);
  }
}
