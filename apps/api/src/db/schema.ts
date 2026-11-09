import {sql} from 'drizzle-orm';
import {bigint, boolean, check, pgTable, varchar} from 'drizzle-orm/pg-core';

export const users = pgTable(
  'users',
  {
    id: bigint('id', {mode: 'number'}).primaryKey().generatedAlwaysAsIdentity(),
    /* 게스트면 null */
    googleSub: varchar('google_sub').unique('users_google_sub_key'),
    isGuest: boolean('is_guest').notNull().default(false),
  },
  (table) => [check('users_is_guest_matches_google_sub', sql`${table.isGuest} = (${table.googleSub} IS NULL)`)],
);
