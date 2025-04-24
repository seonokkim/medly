import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ChatsService } from './chats.service';
import {
  RequestAzureOpenAiGptDto,
  RequestAzureOpenAiGptParamDto,
} from './dto/RequestAzureOpenAiGpt.dto';
import {
  FindAllChatsParamDto,
  FindAllChatsQueryDto,
} from './dto/FindAllChats.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetChatbotAnswerDto } from './dto/GetChatbotAnswer.dto';
import { Request } from 'express';

@ApiTags('챗봇 API')
@Controller('chats')
export class ChatsController {
  private readonly logger = new Logger(ChatsController.name);
  constructor(private readonly chatService: ChatsService) {}

  @Post(':doctorIdx')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: 'Azure OpenAI GPT 모델에 요청',
    description: 'Azure OpenAI GPT 모델에 요청',
  })
  @ApiOkResponse({ description: '성공' })
  @ApiNotFoundResponse({ description: '실패' })
  @ApiInternalServerErrorResponse({ description: '실패' })
  async requestAzureOpenAiGpt(
    @Req() req: Request,
    @Param() requestAzureOpenAiGptParamDto: RequestAzureOpenAiGptParamDto,
    @Body() requestAzureOpenAiGptDto: RequestAzureOpenAiGptDto,
  ) {
    if (requestAzureOpenAiGptParamDto.doctorIdx != req.user?.idx) {
      throw new UnauthorizedException('Unauthorized');
    }
    return await this.chatService.requestAzureOpenAiGpt(
      requestAzureOpenAiGptParamDto,
      requestAzureOpenAiGptDto,
    );
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: 'Medly Chatbot Flask Server API',
    description: 'Medly Chatbot Flask Server API',
  })
  @ApiOkResponse({ description: '성공' })
  @ApiNotFoundResponse({ description: '실패' })
  @ApiInternalServerErrorResponse({ description: '실패' })
  async getChatbotAnswer(
    @Req() req: Request,
    @Body() getChatbotAnswerDto: GetChatbotAnswerDto,
  ) {
    if (getChatbotAnswerDto.doctorIdx != req.user?.idx) {
      throw new UnauthorizedException('Unauthorized');
    }
    return await this.chatService.getChatbotAnswer(getChatbotAnswerDto);
  }

  @Get(':doctorIdx')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: '특정 사용자의 챗봇 Q&A 모두 불러오기',
    description: '특정 사용자의 챗봇 Q&A 데이터를 모두 불러옵니다.',
  })
  @ApiOkResponse({ description: '성공' })
  @ApiNotFoundResponse({ description: '실패' })
  @ApiInternalServerErrorResponse({ description: '실패' })
  async findAll(
    @Req() req: Request,
    @Param() findAllChatsParamDto: FindAllChatsParamDto,
    @Query() findAllChatsQueryDto: FindAllChatsQueryDto,
  ) {
    if (findAllChatsParamDto.doctorIdx != req.user?.idx) {
      throw new UnauthorizedException('Unauthorized');
    }
    return this.chatService.findAll(findAllChatsParamDto, findAllChatsQueryDto);
  }
}
