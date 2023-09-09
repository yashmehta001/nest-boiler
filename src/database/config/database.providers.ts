import { TypeOrmModule } from '@nestjs/typeorm';
import { env } from '../../env';

/**
 * Database provider
 *
 * contains database factory provider
 * we use TypeOrmModule here and add connection
 */
export const DatabaseProvider = TypeOrmModule.forRootAsync({
  useFactory: () => ({
    type: 'postgres',
    host: env.db.host,
    port: env.db.port,
    username: env.db.username,
    password: env.db.password,
    database: env.db.database,
    entities: [`${__dirname}/../../**/*.model.{ts,js}`],
    migrations: [`${__dirname}/../migrations/*.{ts,js}`],
    synchronize: false,
    dropSchema: false,
  }),
});
