import { DataSource } from 'typeorm';
import { env } from '../../env';

export default new DataSource({
  type: 'postgres',
  host: env.db.host,
  port: env.db.port,
  username: env.db.username,
  password: env.db.password,
  database: env.db.database,
  entities: [`${__dirname}/../../**/*.entities.{ts,js}`],
  migrations: [`${__dirname}/../migrations/*.{ts,js}`],
  synchronize: true,
  dropSchema: false,
});
