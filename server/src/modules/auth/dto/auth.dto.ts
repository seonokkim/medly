import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsEnum,
  IsPhoneNumber,
  IsDateString,
} from 'class-validator';
import { DoctorsEntity } from '../../doctors/entities/doctor.entity';

export class RegisterDto {
  @ApiProperty({ example: 'doctor@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Password123!',
    description: '최소 8자, 최대 20자, 영문 대/소문자, 숫자, 특수문자 포함',
  })
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
    {
      message:
        '비밀번호는 최소 8자 이상, 20자 이하, 영문 대/소문자, 숫자, 특수문자를 포함해야 합니다.',
    },
  )
  password: string;

  @ApiProperty({ example: '김의사' })
  @IsString()
  name: string;

  @ApiProperty({ example: '전문의' })
  @IsString()
  role: string;

  @ApiProperty({ example: '01012345678' })
  @IsPhoneNumber('KR')
  phone: string;

  @ApiProperty({ example: 'male' })
  @IsEnum(['male', 'female'])
  gender: 'male' | 'female';

  @ApiProperty({ example: '1980-01-01' })
  @IsDateString()
  dateOfBirth: Date;
}

export class LoginDto {
  @ApiProperty({ example: '01012345678' })
  @IsPhoneNumber('KR')
  phone: string;

  @ApiProperty({ example: 'Password123!' })
  @IsString()
  @MinLength(8)
  password: string;
}

export class AuthResponseDto {
  @ApiProperty()
  access_token: string;

  @ApiProperty({ type: () => DoctorsEntity })
  doctor: DoctorsEntity;
}
