import {DATE_TYPES} from '@plan-for-myself/shared/date-type';
import type {StudyRecord} from '@plan-for-myself/shared/study-record';
import {sql} from 'drizzle-orm';
import {
  bigint,
  boolean,
  check,
  date,
  foreignKey,
  integer,
  pgTable,
  serial,
  text,
  unique,
  varchar,
} from 'drizzle-orm/pg-core';

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

export const studyRecords = pgTable(
  'study_records',
  {
    pk: serial('pk').primaryKey(),
    userId: bigint('user_id', {mode: 'number'}).notNull(),
    recordDate: date('record_date').notNull(),
    timestamp: bigint('timestamp', {mode: 'number'}).notNull(),
    dateType: varchar('date_type', {enum: DATE_TYPES}).notNull(),
    studiedMinutes: integer('studied_minutes').array().notNull().$type<StudyRecord['studiedMinutes']>(),
    failTags: text('fail_tags').array().notNull(),
  },
  (table) => [
    foreignKey({name: 'study_records_user_id_fkey', columns: [table.userId], foreignColumns: [users.id]}),
    unique('study_records_user_id_record_date_key').on(table.userId, table.recordDate),
  ],
);
