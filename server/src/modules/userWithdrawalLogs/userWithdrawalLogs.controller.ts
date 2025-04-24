import { Controller } from '@nestjs/common';
import { UserWithdrawalLogsService } from './userWithdrawalLogs.service';

@Controller('userWithdrawalLogs')
export class UserWithdrawalLogsController {
  constructor(
    private readonly userWithdrawalLogsService: UserWithdrawalLogsService,
  ) {}
}
