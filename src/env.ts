import * as dotenv from 'dotenv';
import {
  checkEmail,
  getOsEnv,
  getOsEnvOptional,
} from './utils/env/env-extensions';
dotenv.config();

export const env = {
  node: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'stagging',
  isDevelopment: process.env.NODE_ENV === 'development',
  port: 0 < parseInt(process.env.PORT) ? parseInt(process.env.PORT) : 3000,
  db: {
    type: getOsEnv('DB_CONNECTION'),
    host: getOsEnvOptional('DB_HOST'),
    port: parseInt(getOsEnvOptional('DB_PORT')),
    username: getOsEnvOptional('DB_USERNAME'),
    password: getOsEnvOptional('DB_PASSWORD'),
    database: getOsEnv('DB_DATABASE'),
    logging: getOsEnv('DB_LOGGING'),
  },
  jwt: {
    secret: getOsEnv('JWT_SECRET'),
    expiresIn: parseInt(getOsEnv('JWT_ACCESS_TOKEN_TTL')),
  },
  admin: {
    firstName: getOsEnv('ADMIN_FIRST_NAME'),
    lastName: getOsEnv('ADMIN_LAST_NAME'),
    email: checkEmail('ADMIN_EMAIL'),
    password: getOsEnv('ADMIN_PASSWORD'),
  },
};
