import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { RegisterDto } from '../auth/dto/auth.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Doctors')
@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new doctor' })
  @ApiResponse({
    status: 201,
    description: 'The doctor has been successfully created.',
  })
  async create(@Body() createDoctorDto: RegisterDto) {
    return this.doctorsService.create(createDoctorDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all doctors' })
  async getAllDoctors() {
    return this.doctorsService.getAllDoctors();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get a doctor by id' })
  async findOne(@Param('id') id: string) {
    return this.doctorsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a doctor' })
  async updateDoctor(
    @Param('id') id: string,
    @Body() updateData: Partial<RegisterDto>,
  ) {
    return this.doctorsService.updateDoctor(+id, updateData);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a doctor' })
  async removeDoctor(@Param('id') id: string) {
    return this.doctorsService.deleteDoctor(+id);
  }
}
