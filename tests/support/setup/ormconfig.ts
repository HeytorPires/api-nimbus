import path from 'node:path';

import { ConnectionOptions } from 'typeorm';

const ROOT = path.resolve(__dirname, '..', '..', '..');

const testOrmConfig: ConnectionOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5433,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'docker',
  database: process.env.DB_NAME || 'nimbus_test',
  entities: [`${ROOT}/src/modules/**/infra/typeorm/entities/*.ts`],
  migrations: [`${ROOT}/src/shared/infra/typeorm/migrations/*.ts`],
  migrationsRun: false,
  synchronize: false,
  logging: false,
};

export default testOrmConfig;
