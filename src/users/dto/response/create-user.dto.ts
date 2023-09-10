import { Expose, Type } from 'class-transformer';
import { UserResDto } from '../index';

export class UserLoginResDto {
  @Expose()
  @Type(() => UserResDto)
  user: UserResDto;

  @Expose()
  token: string;
}
