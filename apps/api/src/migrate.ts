import {Logger} from '@nestjs/common';
import {ImpossibleStateError} from '@plan-for-myself/shared/error';
import {drizzle} from 'drizzle-orm/node-postgres';
import {migrate} from 'drizzle-orm/node-postgres/migrator';
import {Client} from 'pg';
import {MIGRATIONS_DIR} from './db/database';

const CONNECTION_TIMEOUT_MS = 5000;
const logger = new Logger('Migrate');

const connectionString = process.env.POSTGRES_URL;
if (!connectionString) {
  throw new ImpossibleStateError('POSTGRES_URL이 비어 있어 마이그레이션하지 않는다');
}

const client = new Client({connectionString, connectionTimeoutMillis: CONNECTION_TIMEOUT_MS});
await client.connect();
try {
  const before = await countAppliedMigrations(client);
  await migrate(drizzle({client}), {migrationsFolder: MIGRATIONS_DIR});
  const after = await countAppliedMigrations(client);
  logger.log(after > before ? `마이그레이션 ${after - before}개를 적용했다` : '적용할 마이그레이션이 없다');
} finally {
  await client.end();
}

async function countAppliedMigrations(target: Client): Promise<number> {
  const {rows: tableRows} = await target.query<{exists: boolean}>(
    "SELECT to_regclass('drizzle.__drizzle_migrations') IS NOT NULL AS exists",
  );
  if (!tableRows[0]?.exists) {
    return 0;
  }
  const {rows} = await target.query<{count: number}>('SELECT count(*)::int AS count FROM drizzle.__drizzle_migrations');
  return rows[0]?.count ?? 0;
}
