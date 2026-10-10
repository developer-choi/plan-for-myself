// @vitest-environment node
import {PGlite} from '@electric-sql/pglite';
import {beforeEach, describe, expect, it} from 'vitest';
import {createStudyRecord, listStudyRecords} from './repository';

const USER_ID = '1';

const CREATE_STUDY_RECORDS_TABLE = `
  CREATE TABLE study_records (
    pk serial PRIMARY KEY,
    user_id bigint NOT NULL,
    record_date date NOT NULL,
    timestamp bigint NOT NULL,
    date_type varchar NOT NULL,
    studied_minutes integer[] NOT NULL,
    fail_tags varchar[] NOT NULL,
    CONSTRAINT study_records_user_id_record_date_key UNIQUE (user_id, record_date)
  )
`;

describe('listStudyRecords()', () => {
  let db: PGlite;

  beforeEach(async () => {
    db = new PGlite();
    await db.exec(CREATE_STUDY_RECORDS_TABLE);
  });

  async function createRecord(date: string) {
    await createStudyRecord(USER_ID, {date, dateType: 'weekday', studiedMinutes: [0, 0, 0], failTags: []}, db);
  }

  describe('General cases', () => {
    it('저장한 날짜를 YYYY-MM-DD 문자열 그대로 반환해야 한다', async () => {
      await createRecord('2026-10-01');

      const records = await listStudyRecords(USER_ID, null, db);

      expect(records.map((record) => record.date)).toEqual(['2026-10-01']);
    });
  });

  describe('Boundary cases', () => {
    it('조회한 달의 1일과 말일 기록은 포함하고 앞뒤 달 기록은 빼야 한다', async () => {
      await createRecord('2026-09-30');
      await createRecord('2026-10-01');
      await createRecord('2026-10-31');
      await createRecord('2026-11-01');

      const records = await listStudyRecords(USER_ID, {from: '2026-10-01', until: '2026-11-01'}, db);

      expect(records.map((record) => record.date)).toEqual(['2026-10-01', '2026-10-31']);
    });
  });

  describe('Edge cases', () => {
    it('조회한 달에 기록이 없으면 빈 목록을 반환해야 한다', async () => {
      await createRecord('2026-10-01');

      const records = await listStudyRecords(USER_ID, {from: '2026-08-01', until: '2026-09-01'}, db);

      expect(records).toEqual([]);
    });
  });
});

describe('createStudyRecord()', () => {
  let db: PGlite;

  beforeEach(async () => {
    db = new PGlite();
    await db.exec(CREATE_USERS_TABLE);
    await db.exec(CREATE_STUDY_RECORDS_TABLE_WITH_USER_FK);
    await db.query('INSERT INTO users (id) VALUES ($1)', [USER_ID]);
  });

  function create(userId: string) {
    return createStudyRecord(
      userId,
      {date: '2026-10-01', dateType: 'weekday', studiedMinutes: [0, 0, 0], failTags: []},
      db,
    );
  }

  describe('General cases', () => {
    it('있는 사용자의 기록은 저장해야 한다', async () => {
      await create(USER_ID);

      const records = await listStudyRecords(USER_ID, null, db);

      expect(records.map((record) => record.date)).toEqual(['2026-10-01']);
    });
  });

  describe('Edge cases', () => {
    it('사용자 행이 없으면 에러를 던지지 않고 사용자 없음을 반환해야 한다', async () => {
      const result = await create(MISSING_USER_ID);

      expect(result).toEqual({ok: false, reason: 'USER_NOT_FOUND'});
    });

    it('같은 날짜에 이미 기록이 있으면 날짜 중복을 반환해야 한다', async () => {
      await create(USER_ID);

      const result = await create(USER_ID);

      expect(result).toEqual({ok: false, reason: 'DUPLICATE_DATE'});
    });
  });
});

const MISSING_USER_ID = '999';

const CREATE_USERS_TABLE = 'CREATE TABLE users (id bigint PRIMARY KEY)';

/* 운영 DB처럼 user_id가 users를 가리키게 만든다. 위 listStudyRecords 테이블은 사용자 행 없이 기록만 넣으려고 외래키를 뺐다 */
const CREATE_STUDY_RECORDS_TABLE_WITH_USER_FK = CREATE_STUDY_RECORDS_TABLE.replace(
  'user_id bigint NOT NULL,',
  'user_id bigint NOT NULL REFERENCES users (id),',
);
