import type {INestApplication} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import type {Env} from './config/env';
import {setupOpenApi} from './openapi/setup';

export function setupApp(app: INestApplication) {
  app.setGlobalPrefix('api', {exclude: ['health']});
  app.enableCors({
    origin: app.get<ConfigService<Env, true>>(ConfigService).get('CORS_ORIGINS', {infer: true}),
    allowedHeaders: ['Authorization', 'Content-Type'],
    maxAge: CORS_MAX_AGE_SECONDS,
  });
  setupOpenApi(app);
}

const CORS_MAX_AGE_SECONDS = 600;
