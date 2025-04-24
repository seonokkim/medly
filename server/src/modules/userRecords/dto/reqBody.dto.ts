import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddUserRecordBody {
  @ApiProperty({
    description: '수술 명',
    example: '관절 수술',
  })
  @IsNotEmpty()
  @IsString()
  nameOfSurgery: string;

  @ApiProperty({
    description: '수술 상세 기록 내용',
    example:
      '환자가 성공적으로 관절 수술을 받았으며, 회복 중입니다. 수술 과정은 순조로웠고, 특별한 합병증은 없었습니다.',
  })
  @IsNotEmpty()
  @IsString()
  surgeryRecord: string;
}
