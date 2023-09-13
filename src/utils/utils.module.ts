import { Module } from '@nestjs/common';
import { HashModule } from './hash/hash.module';
import { TokenService, JwtService } from './token/services';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import {
  AdminAccessTokenGuard,
  AuthenticationGuard,
  UserAccessTokenGuard,
} from './token/guards';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [HashModule, JwtModule, LoggerModule],
  providers: [
    {
      provide: TokenService,
      useClass: JwtService,
    },
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    UserAccessTokenGuard,
    AdminAccessTokenGuard,
  ],
})
export class UtilsModule {}
