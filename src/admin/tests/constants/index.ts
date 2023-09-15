import {
  AdminCreateReqDto,
  AdminLoginReqDto,
  AdminProfileReqDto,
} from '../../dto';
import { UserType } from '../../../utils/token/types';

export const createAdminInput: AdminCreateReqDto = {
  firstName: 'john',
  lastName: 'doe',
  email: 'john@doe.com',
  password: '123456',
};

export const adminOutput = {
  id: '929270f8-f62e-4580-8533-10d473ce520a',
  firstName: 'john',
  lastName: 'doe',
  email: 'john@doe.com',
  password: '$2b$10$4Dz7cd/nTzDm2Dm2vRbYs.SQUtRrV2pE/Z7L82XataOOJklLPiM.2',
  createdAt: '2023-09-13T01:41:57.449Z',
  updatedAt: '2023-09-13T01:41:57.449Z',
  deletedAt: null,
};

export const loginAdminInput: AdminLoginReqDto = {
  email: 'john@doe.com',
  password: '123456',
};

export const adminProfileInput: AdminProfileReqDto = {
  id: '929270f8-f62e-4580-8533-10d473ce520a',
  userType: UserType.ADMIN,
  email: 'john@doe.com',
  iat: 1234,
  exp: 1234,
};

export const invalidAdmindminProfileInput = {
  id: '929270f8-f62e-4580-8533-10d473ce520a',
  userType: UserType.USER,
  email: 'john@doe.com',
  iat: 1234,
  exp: 1234,
};

export const token = 'token';

export const adminOutputWithToken = {
  token: `Bearer ${token}`,
  user: { ...adminOutput },
};

export const validInputCreate = {
  firstName: 'john',
  lastName: 'doe',
  email: 'john@doe.com',
  password: '123456',
};

export const invalidEmailInputCreate = {
  firstName: 'john',
  lastName: 'doe',
  email: 'johndoe.com',
  password: '123456',
};

export const validInputLogin = {
  email: 'john@doe.com',
  password: '123456',
};

export const invalidInputLogin = {
  email: 'johndoe.com',
  password: '123456',
};
