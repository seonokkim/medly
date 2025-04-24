import { ApiProperty } from '@nestjs/swagger';

export class PatientRecordResponseDto {
  @ApiProperty({ example: 1 })
  idx: number;

  @ApiProperty({ example: '안의진' })
  name: string;

  @ApiProperty({ example: '22981' })
  patientId: string;

  @ApiProperty({ example: '1999-01-01' })
  dateOfBirth: Date;

  @ApiProperty({ example: '2024-01-22' })
  scheduledAt: Date;

  @ApiProperty({
    example: false,
    description: 'false: 설명 필요, true: 설명 완료',
  })
  status: boolean;

  @ApiProperty({ example: '척추 디스크 수술' })
  nameOfSurgery: string;

  @ApiProperty({ example: 'L4-L5 요추 디스크 제거술' })
  surgeryRecord: string;
}

export class GetPatientListResDto {
  @ApiProperty({ type: [PatientRecordResponseDto] })
  patients: PatientRecordResponseDto[];

  @ApiProperty({ example: 10 })
  total: number;
}
