import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class GetUserRecordsByPatientIdParam {
  @ApiProperty({
    description: '환자 식별번호',
    example: 12345,
  })
  @IsNotEmpty()
  patientId: number;
}

export class DeleteUserByIdxParam {
  @ApiProperty({
    description: '유저 인덱스',
    example: 1,
  })
  @IsNotEmpty()
  userIdx: number;
}
