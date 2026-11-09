import type {Breadcrumb, ErrorEvent, EventHint, Integration} from '@sentry/core';
import type {ReactNativeOptions} from '@sentry/react-native';
import {ApiRequestError, ApiResponseError} from '@developer-choi/utils/api';
import {beforeSend} from '@plan-for-myself/shared/sentry';

export const sentryInitOptions = {
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  enabled: process.env.EXPO_PUBLIC_SENTRY_ENABLED === 'true',
  ...(process.env.EXPO_PUBLIC_SENTRY_ENVIRONMENT && {environment: process.env.EXPO_PUBLIC_SENTRY_ENVIRONMENT}),
  enableAutoSessionTracking: false,
  integrations: excludeHeaderIntegration,
  beforeBreadcrumb: excludeRequestBreadcrumb,
  beforeSend: beforeSendFromApp,
} satisfies ReactNativeOptions;

export function excludeHeaderIntegration(integrations: Integration[]): Integration[] {
  return integrations.filter((integration) => integration.name !== 'HttpContext');
}

/* 네이티브 크래시 이벤트에도 실리지 않게 쌓이기 전에 버린다 */
export function excludeRequestBreadcrumb(breadcrumb: Breadcrumb): Breadcrumb | null {
  return breadcrumb.category && REQUEST_BREADCRUMB_CATEGORIES.includes(breadcrumb.category) ? null : breadcrumb;
}

export function beforeSendFromApp(event: ErrorEvent, hint: EventHint): ErrorEvent | null {
  const sendingEvent = beforeSend(event, hint);

  if (sendingEvent?.contexts?.app) {
    delete sendingEvent.contexts.app.permissions;
  }

  const error = hint.originalException;

  if (sendingEvent?.extra && isLoginRequestError(error)) {
    sendingEvent.extra.original = error.message;
  }

  return sendingEvent;
}

const REQUEST_BREADCRUMB_CATEGORIES = ['fetch', 'xhr'];
const LOGIN_REQUEST_PATH = '/api/app-token';

/* 로그인 요청 본문에는 Google ID 토큰이 있어, 오류 객체를 통째로 보내면 토큰이 기기 밖으로 나간다 */
function isLoginRequestError(error: unknown): error is ApiRequestError | ApiResponseError {
  return (
    (error instanceof ApiRequestError || error instanceof ApiResponseError) && error.url.includes(LOGIN_REQUEST_PATH)
  );
}
