import 'dotenv/config';

export default {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'docker',
  database: process.env.DB_NAME || 'nimbus-api',
  entities: [
    process.env.NODE_ENV === 'production'
      ? 'build/src/modules/**/infra/typeorm/entities/*.js'
      : 'src/modules/**/infra/typeorm/entities/*.ts',
  ],
  migrations: [
    process.env.NODE_ENV === 'production'
      ? 'build/src/shared/infra/typeorm/migrations/*.js'
      : 'src/shared/infra/typeorm/migrations/*.ts',
  ],
  migrationsRun: false,
  cli: {
    migrationsDir: './src/shared/infra/typeorm/migrations',
  },
};
