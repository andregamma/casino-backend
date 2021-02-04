import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { resolve, join } from 'path';

config();
const Database: TypeOrmModuleOptions = {
  type: 'mysql',
  keepConnectionAlive: true,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: false,
  entities: [`${resolve(__dirname, '..', 'main', 'entities')}/*`],
  migrationsTableName: 'migration',
  migrations: [
    `${resolve(
      __dirname,
      '..',
      'main',
      'resources',
      'database',
      'migrations',
    )}/*`,
  ],
  cli: {
    migrationsDir: join('src', 'main', 'resources', 'database', 'migrations'),
  },
};

export = Database;
