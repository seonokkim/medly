import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  HttpException,
  HttpStatus,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ChatBotHistoriesService } from './chatBotHistories.service';
import { CreateOneChatBotHistoriesDto } from './dto/CreateOneChatBotHistories.dto';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FindOneByQueryIdxChatBotHistoriesDto } from './dto/FindOneByQueryIdxChatBotHistories.dto';
import { FindAllByDoctorIdxChatBotHistoriesDto } from './dto/FindAllByDoctorIdxChatBotHistories.dto';
import { DeleteOneByIdxChatBotHistoriesDto } from './dto/DeleteOneByIdxChatBotHistories.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';

@ApiTags('챗봇 API')
@Controller('chats/bot')
export class ChatBotHistoriesController {
  constructor(
    private readonly chatBotHistoriesService: ChatBotHistoriesService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: '사용자 질문에 대한 챗봇 답변 저장',
    description:
      '챗봇이 사용자 질의 문자열에 대해 답변한 문자열을 DB에 저장한다.',
  })
  @ApiOkResponse({ description: '저장 성공' })
  @ApiNotFoundResponse({ description: '저장 실패' })
  @ApiInternalServerErrorResponse({ description: '저장 실패' })
  async createOne(
    @Req() req: Request,
    @Body() createOneChatBotHistoriesDto: CreateOneChatBotHistoriesDto,
  ) {
    const doctorIdx = req.user?.idx;
    return this.chatBotHistoriesService.createOne(
      createOneChatBotHistoriesDto,
      doctorIdx,
    );
  }

  @Get(':queryIdx')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: '사용자 질문에 대한 챗봇 답변 불러오기',
    description: '사용자 질문에 대한 챗봇의 답변 문자열을 DB에서 불러온다.',
  })
  @ApiOkResponse({ description: '불러오기 성공' })
  @ApiNotFoundResponse({ description: '불러오기 실패' })
  @ApiInternalServerErrorResponse({ description: '불러오기 실패' })
  async findOneByQueryIdx(
    @Req() req: Request,
    @Param()
    findOneByQueryIdxChatBotHistoriesDto: FindOneByQueryIdxChatBotHistoriesDto,
  ) {
    if (!findOneByQueryIdxChatBotHistoriesDto) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
    const doctorIdx = req.user?.idx;
    return this.chatBotHistoriesService.findOneByQueryIdx(
      findOneByQueryIdxChatBotHistoriesDto,
      doctorIdx,
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: '사용자 기준, 챗봇 답변 모두 불러오기',
    description: '사용자의 모든 질문에 대한 챗봇 답변들을 모두 불러온다.',
  })
  @ApiOkResponse({ description: '불러오기 성공' })
  @ApiNotFoundResponse({ description: '불러오기 실패' })
  @ApiInternalServerErrorResponse({ description: '불러오기 실패' })
  async findAllByDoctorIdx(
    @Req() req: Request,
    @Query()
    findAllByDoctorIdxChatBotHistoriesDto: FindAllByDoctorIdxChatBotHistoriesDto,
  ) {
    if (!findAllByDoctorIdxChatBotHistoriesDto) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
    const doctorIdx = req.user?.idx;

    if (findAllByDoctorIdxChatBotHistoriesDto.doctorIdx != doctorIdx) {
      throw new UnauthorizedException('Unauthorized');
    }

    return this.chatBotHistoriesService.findAllByDoctorIdx(
      findAllByDoctorIdxChatBotHistoriesDto,
    );
  }

  @Delete(':idx')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: '사용자 질문에 대한 챗봇 답변 삭제',
    description:
      '챗봇이 사용자 질의 문자열에 대해 답변한 문자열을 idx 기준으로 DB에서 삭제한다.',
  })
  @ApiOkResponse({ description: '삭제 성공' })
  @ApiNotFoundResponse({ description: '삭제 실패' })
  @ApiInternalServerErrorResponse({ description: '삭제 실패' })
  async deleteOneByIdx(
    @Req() req: Request,
    @Param()
    deleteOneByIdxChatBotHistoriesDto: DeleteOneByIdxChatBotHistoriesDto,
  ) {
    const doctorIdx = req.user?.idx;
    return this.chatBotHistoriesService.deleteOneByIdx(
      deleteOneByIdxChatBotHistoriesDto,
      doctorIdx,
    );
  }
}
