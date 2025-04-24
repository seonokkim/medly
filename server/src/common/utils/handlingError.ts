import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

export function handlingError(err: any) {
  if (err instanceof NotFoundException) {
    throw new NotFoundException();
  } else {
    throw new InternalServerErrorException();
  }
}
