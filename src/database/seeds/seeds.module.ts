import { Module } from '@nestjs/common';
import { AdminModule } from 'src/admin/admin.module';
import { AppSeeder } from './app.seeder';
import { LoggerModule } from '../../utils/logger/logger.module';
import { DatabaseProvider } from '../config/database.providers';

@Module({
  imports: [AdminModule, LoggerModule, DatabaseProvider],
  providers: [AppSeeder],
})
export class SeedsModule {}
