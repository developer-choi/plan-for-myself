import {assert} from 'vitest';
import type {Database} from '../db/database';
import {users} from '../db/schema';

export async function insertGuest(db: Database) {
  const [row] = await db.insert(users).values({isGuest: true}).returning({id: users.id});
  assert(row, '게스트를 넣었는데 돌아온 행이 없다');
  return row.id;
}
