import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './services/admin.service';
import { AdminEntity } from './entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AdminRepository } from './repository/admin.repository';
import { HashService } from '../utils/hash/hash.service';
import { BcryptService } from '../utils/hash/bcrypt/bcrypt.service';
import { TokenService, JwtService } from '../utils/token/services';
import { LoggerModule } from '../utils/logger/logger.module';

@Module({
  imports: [TypeOrmModule.forFeature([AdminEntity]), JwtModule, LoggerModule],
  controllers: [AdminController],
  providers: [
    AdminService,
    AdminRepository,
    {
      provide: HashService,
      useClass: BcryptService,
    },
    {
      provide: TokenService,
      useClass: JwtService,
    },
  ],
  exports: [AdminService],
})
export class AdminModule {}
