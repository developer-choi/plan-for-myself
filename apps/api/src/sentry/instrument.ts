import * as Sentry from '@sentry/nestjs';
import {DrizzleQueryError} from 'drizzle-orm';
import {InvalidEnvError} from '../error/invalid-env.error';

interface PostgresErrorFields {
  code?: string;
  constraint?: string;
  table?: string;
  column?: string;
}

const enabled = process.env.SENTRY_ENABLED === 'true';

if (enabled && (!process.env.SENTRY_DSN || !process.env.SENTRY_ENVIRONMENT)) {
  throw new InvalidEnvError('SENTRY_ENABLED=true면 SENTRY_DSN과 SENTRY_ENVIRONMENT가 있어야 한다');
}

Sentry.init({
  enabled,
  dataCollection: {
    userInfo: false,
    cookies: false,
    httpHeaders: false,
    httpBodies: [],
    urlQueryParams: false,
    stackFrameVariables: false,
  },
  tracesSampleRate: 0,
  beforeSend: removeQueryValues,
});

function removeQueryValues(event: Sentry.ErrorEvent, hint: Sentry.EventHint): Sentry.ErrorEvent {
  const exceptions = event.exception?.values ?? [];
  const exceptionById = new Map(exceptions.map((exception) => [exception.mechanism?.exception_id ?? 0, exception]));
  const errorOf = (id: number): unknown => {
    const mechanism = exceptionById.get(id)?.mechanism;
    if (id === 0 || mechanism?.parent_id === undefined) {
      return hint.originalException;
    }
    return childError(errorOf(mechanism.parent_id), mechanism.source);
  };
  const isUnderQueryError = (id: number): boolean => {
    const parentId = exceptionById.get(id)?.mechanism?.parent_id;
    return parentId !== undefined && (errorOf(parentId) instanceof DrizzleQueryError || isUnderQueryError(parentId));
  };

  for (const [id, exception] of exceptionById) {
    const error = errorOf(id);
    if (error instanceof DrizzleQueryError) {
      exception.value = `Failed query: ${error.query}`;
    } else if (isUnderQueryError(id)) {
      exception.value = describeQueryCause(error);
    }
  }
  return event;
}

function describeQueryCause(cause: unknown): string {
  const {code, constraint, table, column} = (cause ?? {}) as PostgresErrorFields;
  if (code === undefined && cause instanceof Error) {
    return `${cause.name}: ${cause.message}`;
  }
  return JSON.stringify({code, constraint, table, column});
}

function childError(parent: unknown, source: string | undefined): unknown {
  if (source === 'cause') {
    return (parent as Error | undefined)?.cause;
  }
  const errorsIndex = source?.match(/^errors\[(\d+)\]$/)?.[1];
  return errorsIndex === undefined ? undefined : (parent as AggregateError | undefined)?.errors[Number(errorsIndex)];
}
