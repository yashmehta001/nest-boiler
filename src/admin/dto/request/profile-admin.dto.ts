import { UserType } from '../../../utils/token/types';

export class AdminProfileReqDto {
  id: string;
  userType: UserType.ADMIN;
  email: string;
  iat: number;
  exp: number;
}
