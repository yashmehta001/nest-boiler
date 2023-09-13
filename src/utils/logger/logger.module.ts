import { Module } from '@nestjs/common';
import { LoggerService } from './winstonLogger';

@Module({
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
