import * as Sentry from '@sentry/nextjs';
import {sentryInitOptions} from '@/shared/sentry/init-options';

Sentry.init({
  ...sentryInitOptions,
  /* 개인정보처리방침이 오류가 날 때만 보낸다고 적었는데, 이 integration은 오류가 없어도 페이지를 열고 이동할 때마다 세션 정보를 보낸다 */
  integrations: (defaultIntegrations) =>
    defaultIntegrations.filter((integration) => integration.name !== 'BrowserSession'),
});
