import {pool} from '@/server/db/pool';

interface Queryable {
  query(text: string, values: unknown[]): Promise<{rows: {id: string}[]}>;
}

export async function findOrCreateUserId(googleSub: string, db: Queryable = pool): Promise<string> {
  const {
    rows: [{id}],
  } = await db.query(
    `INSERT INTO users (google_sub) VALUES ($1)
     ON CONFLICT (google_sub) DO UPDATE SET google_sub = EXCLUDED.google_sub
     RETURNING id::text AS id`,
    [googleSub],
  );

  return id;
}
