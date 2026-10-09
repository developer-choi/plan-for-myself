import * as Sentry from '@sentry/nextjs';
import {sentryInitOptions} from '@/shared/sentry/init-options';

Sentry.init({
  ...sentryInitOptions,
  /* SDK 10은 들어오는 요청 본문을 dataCollection.httpBodies로 막지 않아 HTTP integration에서 따로 끈다 */
  integrations: [
    Sentry.httpIntegration({
      maxIncomingRequestBodySize: 'none',
      disableIncomingRequestSpans: true,
      trackIncomingRequestsAsSessions: false,
    }),
  ],
});
