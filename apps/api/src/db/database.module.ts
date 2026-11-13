import {Inject, Module, type OnApplicationShutdown} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {createDatabaseConnection, type DatabaseConnection, resolveDatabaseOptions} from './database';

export const DATABASE_CONNECTION = Symbol('DATABASE_CONNECTION');
export const DATABASE = Symbol('DATABASE');

@Module({
  providers: [
    {
      provide: DATABASE_CONNECTION,
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        createDatabaseConnection(
          resolveDatabaseOptions({
            postgresUrl: config.get<string>('POSTGRES_URL'),
            nodeEnv: config.get<string>('NODE_ENV'),
            queryLog: config.get<string>('DB_QUERY_LOG'),
          }),
        ),
    },
    {
      provide: DATABASE,
      inject: [DATABASE_CONNECTION],
      useFactory: (connection: DatabaseConnection) => connection.db,
    },
  ],
  exports: [DATABASE],
})
export class DatabaseModule implements OnApplicationShutdown {
  constructor(@Inject(DATABASE_CONNECTION) private readonly connection: DatabaseConnection) {}

  onApplicationShutdown() {
    return this.connection.close();
  }
}
