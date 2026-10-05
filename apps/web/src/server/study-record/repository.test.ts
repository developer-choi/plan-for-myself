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
