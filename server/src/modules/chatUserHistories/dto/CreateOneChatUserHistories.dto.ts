import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { FindAllByDoctorIdxChatUserHistoriesDto } from './FindAllByDoctorIdxChatUserHistories.dto';

export class CreateOneChatUserHistoriesDto extends FindAllByDoctorIdxChatUserHistoriesDto {
  @ApiProperty({
    description: '사용자 쿼리 문자열',
    example: '복강경담낭절제술 회복 기간 및 시술 후 주의 사항',
    required: true,
  })
  @IsNotEmpty()
  query: string;

  @ApiProperty({
    description: '사용자 쿼리 문자열',
    example: '복강경담낭절제술 회복 기간 및 시술 후 주의 사항',
    required: false,
    nullable: true,
  })
  @IsOptional()
  model: string;
}
