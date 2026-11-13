import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {setupOpenApi} from './openapi/setup';

const DEFAULT_PORT = 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  setupOpenApi(app);
  await app.listen(process.env.PORT ?? DEFAULT_PORT);
}

await bootstrap();
