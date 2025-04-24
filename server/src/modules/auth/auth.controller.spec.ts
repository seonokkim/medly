// src/modules/auth/auth.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DoctorsService } from '../doctors/doctors.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { UnauthorizedException } from '@nestjs/common';
import { DoctorsEntity } from '../doctors/entities/doctor.entity';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

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

  const mockAuthService = {
    register: jest.fn().mockImplementation((dto: RegisterDto) => {
      return { doctor: mockDoctor };
    }),
    login: jest.fn().mockImplementation((dto: LoginDto) => {
      return {
        access_token: 'mock_token',
        doctor: mockDoctor,
      };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: DoctorsService,
          useValue: {},
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should register a doctor and return doctor info', async () => {
      const dto: RegisterDto = {
        email: 'doctor@example.com',
        password: 'password123',
        name: '김의사',
        role: '전문의',
        phone: '01012345678',
        gender: 'male',
        dateOfBirth: new Date('1980-01-01'),
      };

      const result = await authController.register(dto);
      expect(result).toEqual({ doctor: mockDoctor });
      expect(authService.register).toHaveBeenCalledWith(dto);
    });
  });

  describe('login', () => {
    it('should login a doctor and return access token with doctor info', async () => {
      const dto: LoginDto = {
        phone: '01012345678',
        password: 'password123',
      };

      const result = await authController.login(dto);
      expect(result).toEqual({
        access_token: 'mock_token',
        doctor: mockDoctor,
      });
      expect(authService.login).toHaveBeenCalledWith(dto);
    });

    it('should throw UnauthorizedException if login fails', async () => {
      const dto: LoginDto = {
        phone: '01012345678',
        password: 'wrongpassword',
      };

      jest
        .spyOn(authService, 'login')
        .mockRejectedValueOnce(
          new UnauthorizedException('Invalid credentials'),
        );

      await expect(authController.login(dto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('validate', () => {
    it('should return the doctor entity', async () => {
      const result = await authController.validate(mockDoctor as DoctorsEntity);
      expect(result).toEqual(mockDoctor);
    });
  });
});
