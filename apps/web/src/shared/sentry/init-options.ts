import type {BrowserOptions, EdgeOptions, NodeOptions} from '@sentry/nextjs';
import {beforeSend} from '@/shared/sentry/before-send';

export const sentryInitOptions = {
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: process.env.NEXT_PUBLIC_SENTRY_ENABLED === 'true',
  ...(process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT && {environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT}),
  dataCollection: {
    userInfo: false,
    cookies: false,
    httpHeaders: false,
    httpBodies: [],
    urlQueryParams: false,
    stackFrameVariables: false,
  },
  beforeSend,
} satisfies BrowserOptions & NodeOptions & EdgeOptions;
