import {BaseError} from '@developer-choi/utils/api';
import {pool} from '@/server/db/pool';

const GUEST_CREATIONS_LIMIT = 30;
const GUEST_CREATION_WINDOW = '1 hour';

export class GuestLimitError extends BaseError {
  readonly name = 'GuestLimitError';

  constructor() {
    super('같은 IP 해시로 만든 게스트가 한도에 닿았다', {level: 'low'});
  }
}

export interface Queryable {
  query<Row extends Record<string, unknown>>(text: string, values: unknown[]): Promise<{rows: Row[]}>;
}

export async function findOrCreateUserId(googleSub: string, db: Queryable = pool): Promise<string> {
  const {
    rows: [{id}],
  } = await db.query<{id: string}>(
    `INSERT INTO users (google_sub) VALUES ($1)
     ON CONFLICT (google_sub) DO UPDATE SET google_sub = EXCLUDED.google_sub
     RETURNING id::text AS id`,
    [googleSub],
  );

  return id;
}

export async function createGuestUserId(db: Queryable = pool): Promise<string> {
  const {
    rows: [{id}],
  } = await db.query<{id: string}>('INSERT INTO users (is_guest) VALUES (true) RETURNING id::text AS id', []);

  return id;
}

/**
 * @throws {GuestLimitError} 같은 IP 해시로 {@link GUEST_CREATION_WINDOW} 안에 만든 게스트가 한도에 닿았을 때
 */
export async function createGuestUserIdWithinLimit(ipHash: string, db: Queryable = pool): Promise<string> {
  await db.query('DELETE FROM guest_creations WHERE created_at <= now() - $1::interval', [GUEST_CREATION_WINDOW]);

  const {
    rows: [{count}],
  } = await db.query<{count: number}>(
    'SELECT count(*)::int AS count FROM guest_creations WHERE ip_hash = $1 AND created_at > now() - $2::interval',
    [ipHash, GUEST_CREATION_WINDOW],
  );

  if (count >= GUEST_CREATIONS_LIMIT) {
    throw new GuestLimitError();
  }

  await db.query('INSERT INTO guest_creations (ip_hash) VALUES ($1)', [ipHash]);

  return createGuestUserId(db);
}

export async function deleteUser(userId: string, db: Queryable = pool): Promise<void> {
  await db.query(
    `WITH deleted_records AS (DELETE FROM study_records WHERE user_id = $1)
     DELETE FROM users WHERE id = $1`,
    [userId],
  );
}
