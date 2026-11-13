import {Module, type OnApplicationShutdown} from '@nestjs/common';
import {close} from '@sentry/nestjs';

@Module({})
export class SentryShutdownModule implements OnApplicationShutdown {
  onApplicationShutdown() {
    return close(CLOSE_TIMEOUT_MS);
  }
}

const CLOSE_TIMEOUT_MS = 2000;
