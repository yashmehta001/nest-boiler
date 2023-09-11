import { Module } from '@nestjs/common';
import { HashModule } from './hash/hash.module';
import { TokenService, JwtService } from './token/services';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationGuard, AccessTokenGuard } from './token/guards';

@Module({
  imports: [HashModule, JwtModule],
  providers: [
    {
      provide: TokenService,
      useClass: JwtService,
    },
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    AccessTokenGuard,
  ],
})
export class UtilsModule {}
