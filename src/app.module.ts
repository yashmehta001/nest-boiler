import { Module } from '@nestjs/common';
import { UtilsModule } from './utils/utils.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [UtilsModule, DatabaseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
