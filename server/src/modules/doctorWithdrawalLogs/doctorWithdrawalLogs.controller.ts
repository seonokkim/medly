import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DoctorWithdrawalLogsService } from './doctorWithdrawalLogs.service';
import { CreateDoctorWithdrawalLogDto } from './dto/createDoctorWithdrawalLogs.dto';
import { UpdateDoctorWithdrawalLogDto } from './dto/updateDoctorWithdrawalLogs.dto';

@Controller('doctorWithdrawalLogs')
export class DoctorWithdrawalLogsController {
  constructor(
    private readonly doctorWithdrawalLogsService: DoctorWithdrawalLogsService,
  ) {}

  @Post()
  create(@Body() createDoctorWithdrawalLogDto: CreateDoctorWithdrawalLogDto) {
    return this.doctorWithdrawalLogsService.create(
      createDoctorWithdrawalLogDto,
    );
  }

  @Get()
  findAll() {
    return this.doctorWithdrawalLogsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.doctorWithdrawalLogsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDoctorWithdrawalLogDto: UpdateDoctorWithdrawalLogDto,
  ) {
    return this.doctorWithdrawalLogsService.update(
      +id,
      updateDoctorWithdrawalLogDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.doctorWithdrawalLogsService.remove(+id);
  }
}
