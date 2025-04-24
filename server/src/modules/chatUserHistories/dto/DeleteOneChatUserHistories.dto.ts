import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class DeleteOneChatUserHistoriesDto {
  @ApiProperty({
    description: '사용자 쿼리 인덱스',
    example: 1,
    required: true,
  })
  @IsNotEmpty()
  idx: number;
}
