import { Controller, Delete, Get, Param, Query } from '@nestjs/common';
import {
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
  ApiTags,
} from '@nestjs/swagger';

import { UsersService } from './users.service';
import {
  DeleteUserByIdxParam,
  GetUserRecordsByPatientIdParam,
} from './dto/reqParam.dto';
import { DeleteUserByIdxQuery } from './dto/reqQuery.dto';

@ApiTags('유저 API')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/getRecords/:patientId')
  @ApiOperation({
    summary: '환자 수술 기록 조회 API',
    description: '환자의 수술 기록을 조회한다',
  })
  @ApiOkResponse({
    description: 'DB 조회 성공',
  })
  @ApiNotFoundResponse({ description: 'DB가 존재하지 않음' })
  @ApiInternalServerErrorResponse({
    description: '서버가 이해하지 못한 케이스',
  })
  async getUserRecordsByPatientId(
    @Param() param: GetUserRecordsByPatientIdParam,
  ) {
    const { patientId } = param;

    return await this.usersService.getUserRecordsByPatientId(patientId);
  }

  @Delete('/:userIdx')
  @ApiOperation({
    summary: '유저 삭제 API',
    description: '유저의 deletedAt 필드를 업데이트한다',
  })
  @ApiOkResponse({
    description: 'DB 삭제 성공',
  })
  @ApiNotFoundResponse({ description: 'DB가 존재하지 않음' })
  @ApiInternalServerErrorResponse({
    description: '서버가 이해하지 못한 케이스',
  })
  async deleteUserByIdx(
    @Param() param: DeleteUserByIdxParam,
    @Query() query: DeleteUserByIdxQuery,
  ) {
    const { userIdx } = param;
    const { reason } = query;

    return await this.usersService.deleteUserByIdx(userIdx, reason);
  }
}
