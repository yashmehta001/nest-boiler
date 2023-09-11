import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { swaggerLoader } from './utils/loaders';
import { ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import { env } from './env';
import { ExceptionHandlerFilter } from './utils/error/exception-handler.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.use(bodyParser.json({ limit: '2mb' }));
  swaggerLoader(app);
  app.useGlobalFilters(new ExceptionHandlerFilter());
  await app.listen(env.port);
}
bootstrap();
