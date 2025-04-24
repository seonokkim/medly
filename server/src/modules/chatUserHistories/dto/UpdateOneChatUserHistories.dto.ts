import { PartialType } from '@nestjs/swagger';
import { CreateOneChatUserHistoriesDto } from './CreateOneChatUserHistories.dto';

export class UpdateOneChatUserHistoriesDto extends PartialType(
  CreateOneChatUserHistoriesDto,
) {}
