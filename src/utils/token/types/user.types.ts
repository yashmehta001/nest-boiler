import { UserType } from './user.enum';

export type userType = {
  id: number;
  email?: string;
  userType?: UserType;
};
