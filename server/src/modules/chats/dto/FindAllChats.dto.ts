import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class FindAllChatsParamDto {
  @ApiProperty({
    description: '의사 인덱스',
    example: 1,
    required: true,
  })
  @IsNotEmpty()
  doctorIdx: number;
}

export class FindAllChatsQueryDto {
  @ApiProperty({
    description: '챗봇 모델명',
    example: '문헌 검색',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsIn(['문헌 검색', 'PatientCareGPT', 'MedSurgGPT', 'MedBioGPT'])
  model: string;
}
