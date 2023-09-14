import { Injectable } from '@nestjs/common/decorators';
import { JwtService as JwtNestService } from '@nestjs/jwt';
import { userType } from '../types/user.types';
import { env } from '../../../env';

export interface IJwtService {
  token(data: userType): Promise<string>;
  decode(token: string): Promise<any>;
}

@Injectable()
export class JwtService implements IJwtService {
  constructor(private readonly tokenService: JwtNestService) {}

  token(data: userType) {
    return this.tokenService.signAsync(data, env.jwt);
  }

  async decode(token: string) {
    return await this.tokenService.verifyAsync(token, env.jwt);
  }
}
