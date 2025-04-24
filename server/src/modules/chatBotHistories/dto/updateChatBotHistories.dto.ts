import { PartialType } from '@nestjs/swagger';
import { CreateOneChatBotHistoriesDto } from './CreateOneChatBotHistories.dto';

export class UpdateChatBotHistoriesDto extends PartialType(
  CreateOneChatBotHistoriesDto,
) {}
