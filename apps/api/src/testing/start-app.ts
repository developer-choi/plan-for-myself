import type {INestApplication, Type} from '@nestjs/common';
import {Test} from '@nestjs/testing';
import type {App} from 'supertest/types';
import {AppModule} from '../app.module';
import {createDatabaseConnection, type DatabaseConnection} from '../db/database';
import {DATABASE_CONNECTION} from '../db/database.module';
import {setupApp} from '../app.setup';

interface StartAppOptions {
  controllers?: Type[];
}

export function createInMemoryConnection() {
  return createDatabaseConnection({});
}

export async function startApp(connection?: DatabaseConnection, {controllers = []}: StartAppOptions = {}) {
  const moduleRef = await Test.createTestingModule({imports: [AppModule], controllers})
    .overrideProvider(DATABASE_CONNECTION)
    .useValue(connection ?? (await createInMemoryConnection()))
    .compile();
  const app = moduleRef.createNestApplication<INestApplication<App>>({logger: false});
  setupApp(app);
  await app.init();
  return app;
}
