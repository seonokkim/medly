import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { DoctorsService } from '../doctors/doctors.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { UnauthorizedException } from '@nestjs/common';
import { DoctorsEntity } from '../doctors/entities/doctor.entity';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let authService: AuthService;
  let doctorsService: DoctorsService;
  let jwtService: JwtService;

  const mockDoctor: Partial<DoctorsEntity> = {
    idx: 1,
    email: 'doctor@example.com',
    password: 'hashedPassword',
    name: '김의사',
    role: '전문의',
    phone: '01012345678',
    gender: 'male',
    dateOfBirth: new Date('1980-01-01'),
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const mockDoctorsService = {
    create: jest.fn(),
    findByPhone: jest.fn(),
    findOne: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: DoctorsService,
          useValue: mockDoctorsService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    doctorsService = module.get<DoctorsService>(DoctorsService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('register', () => {
    it('should register a new doctor and return doctor info', async () => {
      const registerDto: RegisterDto = {
        email: 'doctor@example.com',
        password: 'password123',
        name: '김의사',
        role: '전문의',
        phone: '01012345678',
        gender: 'male',
        dateOfBirth: new Date('1980-01-01'),
      };

      const hashedPassword = 'hashedPassword';
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockDoctorsService.create.mockResolvedValue(mockDoctor);

      const result = await authService.register(registerDto);

      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);
      expect(doctorsService.create).toHaveBeenCalledWith({
        ...registerDto,
        password: hashedPassword,
      });
      expect(result).toEqual({ doctor: mockDoctor });
    });
  });

  describe('login', () => {
    it('should login a doctor and return access token with doctor info', async () => {
      const loginDto: LoginDto = {
        phone: '01012345678',
        password: 'password123',
      };

      mockDoctorsService.findByPhone.mockResolvedValue(mockDoctor);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue('mock_token');

      const result = await authService.login(loginDto);

      expect(doctorsService.findByPhone).toHaveBeenCalledWith(loginDto.phone);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginDto.password,
        mockDoctor.password,
      );
      expect(jwtService.sign).toHaveBeenCalledWith({
        phone: mockDoctor.phone,
        sub: mockDoctor.idx,
      });
      expect(result).toEqual({
        access_token: 'mock_token',
        doctor: mockDoctor,
      });
    });

    it('should throw UnauthorizedException if doctor not found', async () => {
      const loginDto: LoginDto = {
        phone: '01012345678',
        password: 'password123',
      };

      mockDoctorsService.findByPhone.mockResolvedValue(null);

      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      const loginDto: LoginDto = {
        phone: '01012345678',
        password: 'wrongpassword',
      };

      mockDoctorsService.findByPhone.mockResolvedValue(mockDoctor);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('validateDoctor', () => {
    it('should return doctor if found', async () => {
      mockDoctorsService.findOne.mockResolvedValue(mockDoctor);

      const result = await authService.validateDoctor(1);

      expect(doctorsService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockDoctor);
    });

    it('should throw UnauthorizedException if doctor not found', async () => {
      mockDoctorsService.findOne.mockResolvedValue(null);

      await expect(authService.validateDoctor(1)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
