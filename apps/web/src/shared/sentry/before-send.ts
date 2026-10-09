import type {ErrorEvent, EventHint, SeverityLevel} from '@sentry/nextjs';
import {ApiResponseError, BaseError} from '@developer-choi/utils/api';

export function beforeSend(event: ErrorEvent, hint: EventHint): ErrorEvent | null {
  const error = hint.originalException;

  if (isIgnoredError(error)) {
    return null;
  }

  event.extra ??= {};

  if (error instanceof Error) {
    event.extra.stack = error.stack;
  }

  event.extra.original = error;

  if (!(error instanceof BaseError)) {
    return event;
  }

  event.level = LEVEL_MAP[error.level];
  event.tags = {...event.tags, ...error.tags};
  return event;
}

const UNAUTHORIZED_STATUS = 401;

const LEVEL_MAP: Record<BaseError['level'], SeverityLevel> = {
  fatal: 'fatal',
  error: 'error',
  warning: 'warning',
  low: 'info',
};

function isIgnoredError(error: unknown): boolean {
  return error instanceof ApiResponseError && error.status === UNAUTHORIZED_STATUS;
}
