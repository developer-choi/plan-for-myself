import type {INestApplication} from '@nestjs/common';
import {setupOpenApi} from './openapi/setup';

export function setupApp(app: INestApplication) {
  app.setGlobalPrefix('api', {exclude: ['health']});
  setupOpenApi(app);
}
