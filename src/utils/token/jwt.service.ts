import { Injectable } from '@nestjs/common/decorators';
import { JwtService as JwtNestService } from '@nestjs/jwt';
import { userType } from './types/user.types';
import { env } from 'src/env';

@Injectable()
export class JwtService {
  constructor(private readonly tokenService: JwtNestService) {}

  token(data: userType) {
    return this.tokenService.signAsync(data, env.jwt);
  }

  async decode(token: string) {
    return await this.tokenService.verifyAsync(token, env.jwt);
  }
}
