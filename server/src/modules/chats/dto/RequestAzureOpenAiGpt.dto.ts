import { PickType } from '@nestjs/swagger';
import { FindAllChatsParamDto } from './FindAllChats.dto';
import { GetChatbotAnswerDto } from './GetChatbotAnswer.dto';

export class RequestAzureOpenAiGptDto extends PickType(GetChatbotAnswerDto, [
  'messages',
]) {}

export class RequestAzureOpenAiGptParamDto extends FindAllChatsParamDto {}
