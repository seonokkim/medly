import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class DeleteOneByIdxChatBotHistoriesDto {
  @ApiProperty({
    description: '챗봇 답변 인덱스',
    example: 1,
    required: true,
  })
  @IsNotEmpty()
  idx: number;
}
