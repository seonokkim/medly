import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { FindAllChatsParamDto } from './FindAllChats.dto';

export class GetChatbotAnswerDto extends FindAllChatsParamDto {
  @ApiProperty({
    description: '챗봇 모델명',
    example: '문헌 검색',
    required: true,
  })
  @IsIn(['문헌 검색', 'PatientCareGPT', 'MedSurgGPT', 'MedBioGPT'])
  @IsString()
  @IsNotEmpty()
  model: string;

  @ApiProperty({
    description: '문헌 검색 모드',
    example: 'faq',
    required: false,
  })
  @IsIn(['doc', 'faq'])
  @IsString()
  @IsOptional()
  mode: string;

  @ApiProperty({
    description: '사용자 프롬프트',
    example: '복강경담낭절제술',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  messages: string;
}
