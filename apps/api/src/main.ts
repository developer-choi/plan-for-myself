import './sentry/instrument';
import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {setupApp} from './app.setup';

const DEFAULT_PORT = 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  setupApp(app);
  await app.listen(process.env.PORT ?? DEFAULT_PORT);
}

await bootstrap();
