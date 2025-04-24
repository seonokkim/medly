import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { FindOneByQueryIdxChatBotHistoriesDto } from './FindOneByQueryIdxChatBotHistories.dto';

export class CreateOneChatBotHistoriesDto extends FindOneByQueryIdxChatBotHistoriesDto {
  @ApiProperty({
    description: '챗봇 답변 문자열',
    example: '안녕하세요, 무엇을 도와드릴까요?',
    required: true,
  })
  @IsNotEmpty()
  answer: string;

  @ApiProperty({
    description: '챗봇 답변 문자열에 대한 인용문',
    example: 'a result of RAG',
    required: true,
  })
  @IsOptional()
  citation: string;
}
