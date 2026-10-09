import {pool} from '@/server/db/pool';

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

export interface GoogleLoginRows {
  guestHasRecords: boolean;
  /** 이 OAuth 계정으로 가입된 사용자가 없으면 null */
  registeredUserId: string | null;
}

export async function findGoogleLoginRows(
  guestUserId: string,
  googleSub: string,
  db: Queryable = pool,
): Promise<GoogleLoginRows> {
  const {
    rows: [row],
  } = await db.query<{
    guestHasRecords: boolean;
    /** 이 OAuth 계정으로 가입된 사용자가 없으면 null */
    registeredUserId: string | null;
  }>(
    `SELECT EXISTS (SELECT 1 FROM study_records WHERE user_id = $1) AS "guestHasRecords",
            (SELECT id::text FROM users WHERE google_sub = $2) AS "registeredUserId"`,
    [guestUserId, googleSub],
  );

  return row;
}

/**
 * @throws {Error} 그 사용자가 이미 게스트가 아니라 0행일 때
 */
export async function linkGuestToGoogle(guestUserId: string, googleSub: string, db: Queryable = pool): Promise<void> {
  /* users_is_guest_matches_google_sub 제약 때문에 google_sub와 is_guest를 함께 바꿔야 한다 */
  const {rows} = await db.query<{id: string}>(
    'UPDATE users SET google_sub = $2, is_guest = false WHERE id = $1 AND is_guest RETURNING id::text AS id',
    [guestUserId, googleSub],
  );

  if (rows.length === 0) {
    throw new Error('게스트가 아닌 사용자에 구글 계정을 이으려 했다');
  }
}

/**
 * @throws {Error} 게스트 행이 없거나, 기록을 남기지 않기로 했는데 기록이 있어 0행일 때
 */
export async function deleteGuestUser(
  guestUserId: string,
  {withRecords}: {withRecords: boolean},
  db: Queryable = pool,
): Promise<void> {
  /* study_records.user_id FK에 ON DELETE CASCADE가 없어 기록을 먼저 지워야 사용자 행을 지울 수 있다 */
  if (withRecords) {
    await db.query(
      'DELETE FROM study_records WHERE user_id = $1 AND EXISTS (SELECT 1 FROM users WHERE id = $1 AND is_guest)',
      [guestUserId],
    );
  }

  const {rows} = await db.query<{id: string}>(
    `DELETE FROM users
     WHERE id = $1 AND is_guest AND NOT EXISTS (SELECT 1 FROM study_records WHERE user_id = $1)
     RETURNING id::text AS id`,
    [guestUserId],
  );

  if (rows.length === 0) {
    throw new Error('지울 게스트가 없거나, 남기기로 한 기록이 있다');
  }
}

export async function createGuestUserId(db: Queryable = pool): Promise<string> {
  const {
    rows: [{id}],
  } = await db.query<{id: string}>('INSERT INTO users (is_guest) VALUES (true) RETURNING id::text AS id', []);

  return id;
}

export async function deleteUser(userId: string, db: Queryable = pool): Promise<void> {
  await db.query(
    `WITH deleted_records AS (DELETE FROM study_records WHERE user_id = $1)
     DELETE FROM users WHERE id = $1`,
    [userId],
  );
}
