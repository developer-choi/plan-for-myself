import type {NewStudyRecord, StudyRecordFields} from '@plan-for-myself/shared/study-record';
import {eq} from 'drizzle-orm';
import {assert, beforeEach, describe, expect, it} from 'vitest';
import {createDatabaseConnection, type DatabaseConnection} from '../db/database';
import {studyRecords} from '../db/schema';
import {insertGuest} from '../testing/users';
import {StudyRecordRepository} from './study-record.repository';

describe('StudyRecordRepository', () => {
  let connection: DatabaseConnection;
  let userId: number;

  beforeEach(async () => {
    connection = await createDatabaseConnection({});
    repository = new StudyRecordRepository(connection.db);
    userId = await insertGuest(connection.db);
    return () => connection.close();
  });

  describe('list()', () => {
    describe('General cases', () => {
      it('기록을 날짜 순서로 반환해야 한다', async () => {
        await repository.create(userId, createRecord(RECORD_DATE));
        await repository.create(userId, createRecord('2026-09-01'));

        const records = await repository.list(userId, SEPTEMBER);

        expect(records.map(({date}) => date)).toEqual(['2026-09-01', RECORD_DATE]);
      });
    });

    describe('Boundary cases', () => {
      it('그 달 1일부터 다음 달 1일 전까지의 기록만 반환해야 한다', async () => {
        await repository.create(userId, createRecord('2026-08-31'));
        await repository.create(userId, createRecord('2026-09-01'));
        await repository.create(userId, createRecord('2026-09-30'));
        await repository.create(userId, createRecord('2026-10-01'));

        const records = await repository.list(userId, SEPTEMBER);

        expect(records.map(({date}) => date)).toEqual(['2026-09-01', '2026-09-30']);
      });
    });

    describe('Edge cases', () => {
      it('남의 기록은 반환하지 않아야 한다', async () => {
        await repository.create(await insertGuest(connection.db), createRecord(RECORD_DATE));

        expect(await repository.list(userId, SEPTEMBER)).toEqual([]);
      });
    });
  });

  describe('create()', () => {
    describe('General cases', () => {
      it('저장한 기록을 날짜 문자열과 공부시간 세 칸으로 반환해야 한다', async () => {
        const result = await repository.create(userId, createRecord(RECORD_DATE));

        expect(result).toEqual({
          ok: true,
          record: {
            pk: expect.any(Number) as number,
            date: RECORD_DATE,
            dateType: 'weekday',
            studiedMinutes: [MORNING_MINUTES, 0, 0],
            failTags: ['늦잠'],
          },
        });
      });

      it('timestamp를 그 날 한국 시간 13시의 밀리초로 저장해야 한다', async () => {
        await repository.create(userId, createRecord(RECORD_DATE));

        const [row] = await connection.db
          .select({timestamp: studyRecords.timestamp})
          .from(studyRecords)
          .where(eq(studyRecords.userId, userId));

        expect(row?.timestamp).toBe(Date.parse(`${RECORD_DATE}T13:00:00+09:00`));
      });
    });

    describe('Edge cases', () => {
      it('같은 날짜에 두 번 저장하면 DUPLICATE_DATE를 반환해야 한다', async () => {
        await repository.create(userId, createRecord(RECORD_DATE));

        expect(await repository.create(userId, createRecord(RECORD_DATE))).toEqual({
          ok: false,
          reason: 'DUPLICATE_DATE',
        });
      });

      it('없는 사용자의 기록이면 USER_NOT_FOUND를 반환해야 한다', async () => {
        expect(await repository.create(MISSING_USER_ID, createRecord(RECORD_DATE))).toEqual({
          ok: false,
          reason: 'USER_NOT_FOUND',
        });
      });
    });
  });

  describe('update()', () => {
    describe('General cases', () => {
      it('내 기록이면 고친 기록을 반환해야 한다', async () => {
        const pk = await createRecordPk(userId);

        expect(await repository.update({userId, pk}, createFields('holiday'))).toMatchObject({
          pk,
          dateType: 'holiday',
        });
      });
    });

    describe('Edge cases', () => {
      it('남의 기록이면 null을 반환해야 한다', async () => {
        const pk = await createRecordPk(userId);

        expect(
          await repository.update({userId: await insertGuest(connection.db), pk}, createFields('holiday')),
        ).toBeNull();
      });

      it('남의 기록이면 고치지 않아야 한다', async () => {
        const pk = await createRecordPk(userId);

        await repository.update({userId: await insertGuest(connection.db), pk}, createFields('holiday'));

        expect(await repository.list(userId, SEPTEMBER)).toMatchObject([{dateType: 'weekday'}]);
      });
    });
  });

  describe('delete()', () => {
    describe('General cases', () => {
      it('내 기록이면 true를 반환해야 한다', async () => {
        expect(await repository.delete({userId, pk: await createRecordPk(userId)})).toBe(true);
      });

      it('내 기록이면 지워야 한다', async () => {
        await repository.delete({userId, pk: await createRecordPk(userId)});

        expect(await repository.list(userId, SEPTEMBER)).toEqual([]);
      });
    });

    describe('Edge cases', () => {
      it('남의 기록이면 false를 반환해야 한다', async () => {
        const pk = await createRecordPk(userId);

        expect(await repository.delete({userId: await insertGuest(connection.db), pk})).toBe(false);
      });

      it('남의 기록이면 지우지 않아야 한다', async () => {
        const pk = await createRecordPk(userId);

        await repository.delete({userId: await insertGuest(connection.db), pk});

        expect(await repository.list(userId, SEPTEMBER)).toHaveLength(1);
      });
    });
  });
});

const RECORD_DATE = '2026-09-24';
const MORNING_MINUTES = 30;
const MISSING_USER_ID = 999;
const SEPTEMBER = {from: '2026-09-01', until: '2026-10-01'};

let repository: StudyRecordRepository;

function createFields(dateType: StudyRecordFields['dateType'] = 'weekday'): StudyRecordFields {
  return {dateType, studiedMinutes: [MORNING_MINUTES, 0, 0], failTags: ['늦잠']};
}

function createRecord(date: string): NewStudyRecord {
  return {date, ...createFields()};
}

async function createRecordPk(owner: number) {
  const result = await repository.create(owner, createRecord(RECORD_DATE));
  assert(result.ok, '테스트 기록을 만들지 못했다');
  return result.record.pk;
}
