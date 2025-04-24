import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DoctorsService } from '../doctors/doctors.service';
import { RegisterDto, LoginDto, AuthResponseDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { DoctorsEntity } from '../doctors/entities/doctor.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly doctorsService: DoctorsService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<DoctorsEntity> {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const doctor = await this.doctorsService.create({
      ...registerDto,
      password: hashedPassword,
    });
    return doctor;
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const doctor = await this.doctorsService.findByPhone(loginDto.phone);
    if (!doctor) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      doctor.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { phone: doctor.phone, sub: doctor.idx };
    return {
      access_token: this.jwtService.sign(payload),
      doctor: doctor,
    };
  }

  async validateDoctor(id: number) {
    const doctor = await this.doctorsService.findOne(id);
    if (!doctor) {
      throw new UnauthorizedException('Doctor not found');
    }
    return doctor;
  }
}
