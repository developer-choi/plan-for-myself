import type {ErrorEvent, EventHint, SeverityLevel} from '@sentry/core';
import {BaseError} from '@developer-choi/utils/api';
import {isUnauthorizedError} from '../error/unauthorized';

export function beforeSend(event: ErrorEvent, hint: EventHint): ErrorEvent | null {
  const error = hint.originalException;

  if (isUnauthorizedError(error)) {
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

const LEVEL_MAP: Record<BaseError['level'], SeverityLevel> = {
  fatal: 'fatal',
  error: 'error',
  warning: 'warning',
  low: 'info',
};
