import { env } from '../../env';

export const AdminUsersSeedData = [
  {
    firstName: env.admin.firstName,
    lastName: env.admin.lastName,
    email: env.admin.email,
    password: env.admin.password,
  },
];
