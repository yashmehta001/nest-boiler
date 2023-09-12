import { HttpException, HttpStatus } from '@nestjs/common';

export class UnauthorizedException extends HttpException {
  constructor() {
    super(`Unauthories User`, HttpStatus.UNAUTHORIZED);
  }
}
