import { Test, TestingModule } from '@nestjs/testing';
import { DoctorWithdrawalLogsService } from './doctorWithdrawalLogs.service';

describe('DoctorWithdrawalLogsService', () => {
  let service: DoctorWithdrawalLogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DoctorWithdrawalLogsService],
    }).compile();

    service = module.get<DoctorWithdrawalLogsService>(
      DoctorWithdrawalLogsService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
