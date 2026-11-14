import {fileURLToPath} from 'node:url';
import {PGlite} from '@electric-sql/pglite';
import {Logger} from '@nestjs/common';
import {ImpossibleStateError} from '@plan-for-myself/shared/error';
import type {Logger as DrizzleLogger} from 'drizzle-orm';
import {drizzle as drizzlePg} from 'drizzle-orm/node-postgres';
import type {PgDatabase, PgQueryResultHKT} from 'drizzle-orm/pg-core';
import {drizzle as drizzlePglite} from 'drizzle-orm/pglite';
import {migrate} from 'drizzle-orm/pglite/migrator';
import {Pool} from 'pg';

export type Database = PgDatabase<PgQueryResultHKT>;

export interface DatabaseConnection {
  db: Database;
  close(): Promise<void>;
}

interface DatabaseOptions {
  connectionString?: string;
  dataDir?: string;
  logQueries?: boolean;
}

interface DatabaseEnv {
  /** 환경변수 POSTGRES_URL이 없거나 빈 값이면 비어 있다 */
  postgresUrl?: string;
  /** 환경변수 NODE_ENV가 없으면 비어 있다 */
  nodeEnv?: string;
  /** 환경변수 DB_QUERY_LOG가 없으면 비어 있다 */
  queryLog?: string;
}

export function resolveDatabaseOptions({postgresUrl, nodeEnv, queryLog}: DatabaseEnv): DatabaseOptions {
  const logQueries = queryLog === 'true';
  if (postgresUrl) {
    return {connectionString: postgresUrl, logQueries};
  }
  if (nodeEnv === 'production') {
    throw new ImpossibleStateError('운영(NODE_ENV=production)에서는 POSTGRES_URL이 있어야 한다');
  }
  return {dataDir: LOCAL_DATA_DIR, logQueries};
}

export async function createDatabaseConnection({
  connectionString,
  dataDir,
  logQueries,
}: DatabaseOptions): Promise<DatabaseConnection> {
  if (connectionString) {
    const pool = new Pool({
      connectionString,
      connectionTimeoutMillis: CONNECTION_TIMEOUT_MS,
      // eslint-disable-next-line @typescript-eslint/naming-convention -- pg가 정한 옵션 이름이다
      query_timeout: QUERY_TIMEOUT_MS,
    });
    pool.on('error', (error) => logger.error('DB 연결 풀 에러', error));
    return {db: drizzlePg({client: pool, logger: toQueryLogger(logQueries)}), close: () => pool.end()};
  }

  /* 운영 Postgres의 테이블은 아직 웹 마이그레이션이 만들어서 PGlite에만 적용한다 */
  const client = await PGlite.create(dataDir);
  const db = drizzlePglite({client, logger: toQueryLogger(logQueries)});
  await migrate(db, {migrationsFolder: MIGRATIONS_DIR});
  return {db, close: () => client.close()};
}

const LOCAL_DATA_DIR = '.local-db';
/* 번들에서는 이 파일이 dist 바로 아래라 tsdown.config.ts의 copy가 dist/migrations에 둔다 */
const MIGRATIONS_DIR = fileURLToPath(new URL('./migrations', import.meta.url));
const CONNECTION_TIMEOUT_MS = 5000;
const QUERY_TIMEOUT_MS = 10_000;
const logger = new Logger('Database');
const queryLogger = new Logger('Query');

/* 쿼리 값에는 사용자 정보가 들어가서 SQL 문장만 남긴다 */
function toQueryLogger(logQueries: boolean | undefined): DrizzleLogger | false {
  return logQueries ? {logQuery: (query) => queryLogger.log(query)} : false;
}
