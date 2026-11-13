import type {INestApplication} from '@nestjs/common';
import {Test} from '@nestjs/testing';
import type {App} from 'supertest/types';
import {AppModule} from '../app.module';
import {createDatabaseConnection, type DatabaseConnection} from '../db/database';
import {DATABASE_CONNECTION} from '../db/database.module';
import {setupOpenApi} from '../openapi/setup';

export function createInMemoryConnection() {
  return createDatabaseConnection({});
}

export async function startApp(connection?: DatabaseConnection) {
  const moduleRef = await Test.createTestingModule({imports: [AppModule]})
    .overrideProvider(DATABASE_CONNECTION)
    .useValue(connection ?? (await createInMemoryConnection()))
    .compile();
  const app = moduleRef.createNestApplication<INestApplication<App>>({logger: false});
  setupOpenApi(app);
  await app.init();
  return app;
}
