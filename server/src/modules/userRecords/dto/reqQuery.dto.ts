import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetPatientListReqQueryDto {
  @ApiProperty({ required: false, description: '환자 이름으로 검색' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false, description: '환자 ID로 검색' })
  @IsOptional()
  @IsString()
  patientId?: string;
}
