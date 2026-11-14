import {beforeEach, describe, expect, it} from 'vitest';
import {insertGuest} from '../testing/users';
import {createDatabaseConnection, type DatabaseConnection} from './database';
import {studyRecords, users} from './schema';

describe('users 테이블', () => {
  let connection: DatabaseConnection;

  beforeEach(async () => {
    connection = await createDatabaseConnection({});
    return () => connection.close();
  });

  describe('General cases', () => {
    it('Google 계정만 주고 저장하면 게스트가 아닌 사용자로 저장해야 한다', async () => {
      const rows = await connection.db
        .insert(users)
        .values({googleSub: 'google-sub'})
        .returning({isGuest: users.isGuest});

      expect(rows).toEqual([{isGuest: false}]);
    });
  });

  describe('Edge cases', () => {
    it('Google 계정이 없는 게스트는 여러 명 저장해야 한다', async () => {
      const rows = await connection.db
        .insert(users)
        .values([{isGuest: true}, {isGuest: true}])
        .returning({id: users.id});

      expect(rows).toHaveLength(2);
    });

    it('같은 Google 계정을 두 번 저장하면 거절해야 한다', async () => {
      await connection.db.insert(users).values({googleSub: 'google-sub'});

      await expect(connection.db.insert(users).values({googleSub: 'google-sub'})).rejects.toMatchObject({
        cause: {constraint: 'users_google_sub_key'},
      });
    });

    describe('게스트이면', () => {
      it('Google 계정이 있을 때 거절해야 한다', async () => {
        await expect(
          connection.db.insert(users).values({isGuest: true, googleSub: 'google-sub'}),
        ).rejects.toMatchObject({cause: {constraint: 'users_is_guest_matches_google_sub'}});
      });
    });

    describe('게스트가 아니면', () => {
      it('Google 계정이 없을 때 거절해야 한다', async () => {
        await expect(connection.db.insert(users).values({isGuest: false})).rejects.toMatchObject({
          cause: {constraint: 'users_is_guest_matches_google_sub'},
        });
      });
    });
  });
});

describe('study_records 테이블', () => {
  let connection: DatabaseConnection;

  beforeEach(async () => {
    connection = await createDatabaseConnection({});
    return () => connection.close();
  });

  describe('Edge cases', () => {
    it('같은 사용자가 같은 날짜에 두 번 저장하면 날짜 중복 제약으로 거절해야 한다', async () => {
      const userId = await insertGuest(connection.db);
      await connection.db.insert(studyRecords).values(createRecordRow(userId));

      await expect(connection.db.insert(studyRecords).values(createRecordRow(userId))).rejects.toMatchObject({
        cause: {constraint: 'study_records_user_id_record_date_key'},
      });
    });

    it('다른 사용자는 같은 날짜에 저장해야 한다', async () => {
      await connection.db.insert(studyRecords).values(createRecordRow(await insertGuest(connection.db)));

      const rows = await connection.db
        .insert(studyRecords)
        .values(createRecordRow(await insertGuest(connection.db)))
        .returning({pk: studyRecords.pk});

      expect(rows).toHaveLength(1);
    });

    it('없는 사용자의 기록을 저장하면 사용자 외래키 제약으로 거절해야 한다', async () => {
      await expect(connection.db.insert(studyRecords).values(createRecordRow(MISSING_USER_ID))).rejects.toMatchObject({
        cause: {constraint: 'study_records_user_id_fkey'},
      });
    });
  });
});

const MISSING_USER_ID = 999;

function createRecordRow(userId: number): typeof studyRecords.$inferInsert {
  return {
    userId,
    recordDate: '2026-09-24',
    timestamp: 0,
    dateType: 'weekday',
    studiedMinutes: [0, 0, 0],
    failTags: ['늦잠'],
  };
}
