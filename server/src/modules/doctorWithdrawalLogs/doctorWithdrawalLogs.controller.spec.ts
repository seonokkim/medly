import { Test, TestingModule } from '@nestjs/testing';
import { DoctorWithdrawalLogsController } from './doctorWithdrawalLogs.controller';
import { DoctorWithdrawalLogsService } from './doctorWithdrawalLogs.service';

describe('DoctorWithdrawalLogsController', () => {
  let controller: DoctorWithdrawalLogsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DoctorWithdrawalLogsController],
      providers: [DoctorWithdrawalLogsService],
    }).compile();

    controller = module.get<DoctorWithdrawalLogsController>(
      DoctorWithdrawalLogsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
