import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundException extends HttpException {
  constructor() {
    super(`Admin User Not Found`, HttpStatus.NOT_FOUND);
  }
}
