import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserAccessTokenGuard } from './userToken.guard';
import { Reflector } from '@nestjs/core';
import { AuthType } from '../types';
import { AUTH_TYPE_KEY } from '../../decorators/auth.decorator';
import { AdminAccessTokenGuard } from './adminToken.guard';
import { UnauthorizedException } from '../errors';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private static readonly defaultAuthType = AuthType.UserBearer;
  private readonly authTypeGuardMap: Record<
    AuthType,
    CanActivate | CanActivate[]
  > = {
    [AuthType.UserBearer]: this.userAccessTokenGuard,
    [AuthType.AdminBearer]: this.adminAccessTokenGuard,
    [AuthType.None]: { canActivate: () => true },
  };

  constructor(
    private readonly reflector: Reflector,
    private readonly userAccessTokenGuard: UserAccessTokenGuard,
    private readonly adminAccessTokenGuard: AdminAccessTokenGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authTypes = this.reflector.getAllAndOverride<AuthType[]>(
      AUTH_TYPE_KEY,
      [context.getHandler(), context.getClass()],
    ) ?? [AuthenticationGuard.defaultAuthType];

    const guards = authTypes.map((type) => this.authTypeGuardMap[type]).flat();

    let error = new UnauthorizedException();

    for (const instance of guards) {
      const canActivate = await Promise.resolve(
        instance.canActivate(context),
      ).catch((err) => {
        error = err;
      });

      if (canActivate) {
        return true;
      }
      throw error;
    }
  }
}
