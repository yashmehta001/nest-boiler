import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { errorType } from './types';

@Catch(HttpException)
export class ExceptionHandlerFilter<T extends HttpException>
  implements ExceptionFilter
{
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    const error = typeof response === 'string'
        ? { message: exceptionResponse }
        : (exceptionResponse as object);
    response.status(status).json({
      Error: true,
      message: [error],
      data: {},
    });
  }
}
