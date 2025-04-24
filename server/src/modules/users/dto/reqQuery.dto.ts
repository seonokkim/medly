import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class DeleteUserByIdxQuery {
  @ApiProperty({
    description: '회원탈퇴 사유',
    example: 'noContent',
  })
  @IsNotEmpty()
  reason: string;
}
