import * as dotenv from 'dotenv';
dotenv.config();
export const env = {
  node: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'stagging',
  isDevelopment: process.env.NODE_ENV === 'development',
  port: ( 0 > parseInt(process.env.PORT))?parseInt(process.env.PORT):3000,
};
