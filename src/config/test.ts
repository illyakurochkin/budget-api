import { setDefaultDataSource } from '@adrien-may/factory';
import { DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { DataType, IMemoryDb, newDb } from 'pg-mem';
import { entities } from './typeorm';
import { DataSource } from 'typeorm';
import { v4 } from 'uuid';

export type TestDatabase = {
  dataSource: DataSource;
  restore: VoidFunction;
  typeOrmModules: DynamicModule[];
  db: IMemoryDb;
};

export const createTestDatabase = async (
  entitiesForFeature: EntityClassOrSchema[] = [],
): Promise<TestDatabase> => {
  const db = newDb({
    autoCreateForeignKeyIndices: true,
  });

  db.registerExtension('uuid-ossp', (schema) => {
    schema.registerFunction({
      implementation: v4,
      impure: true,
      name: 'uuid_generate_v4',
      returns: DataType.uuid,
    });
  });

  db.public.registerFunction({
    args: [],
    implementation: () => 'pflegia',
    name: 'current_database',
    returns: DataType.text,
  });

  db.public.registerFunction({
    name: 'trunc',
    args: [DataType.float, DataType.integer],
    returns: DataType.float,
    implementation: (value: number, precision: number) =>
      value.toFixed(precision),
  });

  db.public.registerFunction({
    args: [],
    implementation: () => '1',
    name: 'version',
    returns: DataType.text,
  });

  const dataSource = await db.adapters.createTypeormDataSource({
    db,
    entities,
    type: 'postgres',
  });

  await dataSource.initialize();
  await dataSource.synchronize();

  setDefaultDataSource(dataSource);

  const backup = db.backup();

  return {
    dataSource,
    db,
    restore: () => {
      backup.restore();
    },
    typeOrmModules: [
      TypeOrmModule.forRootAsync({
        dataSourceFactory: () => Promise.resolve(dataSource),
        useFactory: () => ({ type: 'postgres' }),
      }),
      TypeOrmModule.forFeature(entitiesForFeature),
    ],
  };
};
