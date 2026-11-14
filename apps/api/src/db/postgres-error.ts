import {DrizzleQueryError} from 'drizzle-orm';

interface PostgresErrorFields {
  code?: string;
  constraint?: string;
  table?: string;
  column?: string;
}

export const POSTGRES_ERROR_CODES = {
  UNIQUE_VIOLATION: '23505',
  FOREIGN_KEY_VIOLATION: '23503',
} as const;

/**
 * null: Drizzle 쿼리 오류가 아니거나 Postgres가 준 원인이 없다
 */
export function readPostgresError(error: unknown): PostgresErrorFields | null {
  return error instanceof DrizzleQueryError && error.cause ? (error.cause as PostgresErrorFields) : null;
}
