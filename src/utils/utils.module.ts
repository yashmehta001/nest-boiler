import { Module } from '@nestjs/common';
import { HashModule } from './hash/hash.module';
import { TokenService } from './token/token.service';
import { JwtService } from './token/jwt.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [HashModule, JwtModule],
  providers: [
    {
      provide: TokenService,
      useClass: JwtService,
    },
  ],
})
export class UtilsModule {}
