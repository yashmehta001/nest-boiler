import { Module } from '@nestjs/common';
import { UtilsModule } from './utils/utils.module';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [UtilsModule, DatabaseModule, UsersModule, AdminModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
