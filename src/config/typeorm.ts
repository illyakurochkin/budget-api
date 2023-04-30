import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { DataSource } from 'typeorm';
import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SourceEntity } from '../modules/source/source.entity';
import { BlockEntity } from '../modules/block/block.entity';
import 'dotenv/config';

const entities = [SourceEntity, BlockEntity];

const config: PostgresConnectionOptions = {
  entities,
  type: 'postgres',
  logging: ['error'],
  ssl: false,
  synchronize: true,
  url: process.env.DATABASE_URL,
};

const dataSource = new DataSource(config);

const moduleConfig = registerAs(
  'typeorm',
  (): TypeOrmModuleOptions => ({
    ...config,
  }),
);

export { config, entities, dataSource, moduleConfig };
