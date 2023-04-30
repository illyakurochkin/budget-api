import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as path from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SourceModule } from './modules/source/source.module';
import { moduleConfig as typeormConfig } from './config/typeorm';
import configuration from './config/configuration';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { apolloConfig } from './config/apollo';
import { DebugModule } from './modules/debug/debug.module';
import { BlockModule } from './modules/block/block.module';
import { AuthModule } from './modules/auth/auth.module';
import { SummaryModule } from './modules/summary/summary.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      cache: true,
      envFilePath: [path.resolve('.env')],
      load: [configuration, typeormConfig],
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ConfigModule],
      useFactory: () => ({
        autoSchemaFile: true,
        persistedQueries: false,
        ...apolloConfig,
        context: (context) => ({
          ...context,
          ...(typeof apolloConfig.context === 'function' &&
            apolloConfig.context(context)),
        }),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        configService.get('typeorm'),
      inject: [ConfigService],
    }),
    SourceModule,
    BlockModule,
    SummaryModule,
    DebugModule,
  ],
})
export class AppModule {}
