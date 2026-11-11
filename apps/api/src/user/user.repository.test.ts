import {sql} from 'drizzle-orm';
import {beforeEach, describe, expect, it} from 'vitest';
import {createDatabaseConnection, type DatabaseConnection} from '../db/database';
import {findRecordOwners, findUser, insertGoogleUser, insertGuest, insertRecord} from '../testing/users';
import {UserRepository} from './user.repository';

describe('UserRepository', () => {
  let repository: UserRepository;

  beforeEach(async () => {
    connection = await createDatabaseConnection({});
    repository = new UserRepository(connection.db);
    return () => connection.close();
  });

  describe('findGoogleLoginRows()', () => {
    describe('General cases', () => {
      it('기록 있는 게스트가 가입된 Google 계정으로 오면 게스트 여부·기록 여부·가입된 사용자 번호를 반환해야 한다', async () => {
        const googleSub = 'registered-sub';
        const guestId = await insertGuest(connection.db);
        await insertRecord(connection.db, guestId);
        const registeredId = await insertGoogleUser(connection.db, googleSub);

        expect(await repository.findGoogleLoginRows(guestId, googleSub)).toEqual({
          isStillGuest: true,
          guestHasRecords: true,
          registeredUserId: registeredId,
        });
      });

      it('기록 없는 게스트가 처음 보는 Google 계정으로 오면 게스트 여부·기록 여부·가입된 사용자 번호를 반환해야 한다', async () => {
        const guestId = await insertGuest(connection.db);

        expect(await repository.findGoogleLoginRows(guestId, 'new-sub')).toEqual({
          isStillGuest: true,
          guestHasRecords: false,
          registeredUserId: null,
        });
      });
    });

    describe('Edge cases', () => {
      it('그 번호가 이미 Google 사용자면 게스트가 아니라고 반환해야 한다', async () => {
        const userId = await insertGoogleUser(connection.db, 'holder-sub');

        expect(await repository.findGoogleLoginRows(userId, 'new-sub')).toMatchObject({isStillGuest: false});
      });

      it('그 번호의 사용자가 없으면 게스트가 아니라고 반환해야 한다', async () => {
        expect(await repository.findGoogleLoginRows(MISSING_USER_ID, 'new-sub')).toMatchObject({
          isStillGuest: false,
        });
      });
    });
  });

  describe('linkGuestToGoogle()', () => {
    describe('Edge cases', () => {
      it('이미 Google 사용자면 그 계정을 바꾸지 않아야 한다', async () => {
        const userId = await insertGoogleUser(connection.db, 'holder-sub');

        await repository.linkGuestToGoogle(userId, 'new-sub');

        expect(await findUser(connection.db, userId)).toEqual({isGuest: false, googleSub: 'holder-sub'});
      });

      it('그 Google 계정으로 다른 사용자가 이미 가입했으면 false를 반환해야 한다', async () => {
        const googleSub = 'taken-sub';
        await insertGoogleUser(connection.db, googleSub);
        const guestId = await insertGuest(connection.db);

        expect(await repository.linkGuestToGoogle(guestId, googleSub)).toBe(false);
      });

      it('동시 요청과 무관한 제약 위반이면 그 오류를 던져야 한다', async () => {
        const guestId = await insertGuest(connection.db);
        await raiseUnrelatedUniqueViolationOnUserUpdate();

        await expect(repository.linkGuestToGoogle(guestId, 'new-sub')).rejects.toMatchObject({
          cause: {code: '23505', constraint: 'unrelated_key'},
        });
      });
    });
  });

  describe('deleteGuestWithRecords()', () => {
    describe('Edge cases', () => {
      it('게스트를 지우면 다른 사용자의 기록은 남아 있어야 한다', async () => {
        const guestId = await insertGuest(connection.db);
        const otherId = await insertGuest(connection.db);
        await insertRecord(connection.db, guestId);
        await insertRecord(connection.db, otherId);

        await repository.deleteGuestWithRecords(guestId);

        expect(await findRecordOwners(connection.db, otherId)).toEqual([{userId: otherId}]);
      });

      it('이미 Google 사용자면 그 사용자의 기록을 남겨야 한다', async () => {
        const userId = await insertGoogleUser(connection.db, 'holder-sub');
        await insertRecord(connection.db, userId);

        await repository.deleteGuestWithRecords(userId);

        expect(await findRecordOwners(connection.db, userId)).toEqual([{userId}]);
      });
    });
  });

  describe('deleteGuestWithoutRecords()', () => {
    describe('Edge cases', () => {
      it('게스트에게 기록이 있으면 그 기록을 남겨야 한다', async () => {
        const guestId = await insertGuest(connection.db);
        await insertRecord(connection.db, guestId);

        await repository.deleteGuestWithoutRecords(guestId);

        expect(await findRecordOwners(connection.db, guestId)).toEqual([{userId: guestId}]);
      });

      it('게스트에게 기록이 있으면 false를 반환해야 한다', async () => {
        const guestId = await insertGuest(connection.db);
        await insertRecord(connection.db, guestId);

        expect(await repository.deleteGuestWithoutRecords(guestId)).toBe(false);
      });
    });
  });

  describe('게스트 행을 바꾸는 쓰기', () => {
    describe('Edge cases', () => {
      [
        {name: 'linkGuestToGoogle()', write: (userId: number) => repository.linkGuestToGoogle(userId, 'new-sub')},
        {name: 'deleteGuestWithRecords()', write: (userId: number) => repository.deleteGuestWithRecords(userId)},
        {name: 'deleteGuestWithoutRecords()', write: (userId: number) => repository.deleteGuestWithoutRecords(userId)},
      ].forEach(({name, write}) => {
        it(`${name}는 이미 Google 사용자면 false를 반환해야 한다`, async () => {
          const userId = await insertGoogleUser(connection.db, 'holder-sub');

          expect(await write(userId)).toBe(false);
        });
      });

      [
        {name: 'deleteGuestWithRecords()', write: (userId: number) => repository.deleteGuestWithRecords(userId)},
        {name: 'deleteGuestWithoutRecords()', write: (userId: number) => repository.deleteGuestWithoutRecords(userId)},
      ].forEach(({name, write}) => {
        it(`${name}는 지우는 도중 그 게스트의 기록이 새로 들어오면 false를 반환해야 한다`, async () => {
          const guestId = await insertGuest(connection.db);
          await insertRecordOnUserDelete();

          expect(await write(guestId)).toBe(false);
        });
      });
    });
  });
});

const MISSING_USER_ID = 999_999;

let connection: DatabaseConnection;

async function raiseUnrelatedUniqueViolationOnUserUpdate() {
  await connection.db.execute(sql`
    CREATE FUNCTION raise_unrelated_unique_violation() RETURNS trigger AS $$
    BEGIN
      RAISE EXCEPTION 'unrelated' USING ERRCODE = '23505', CONSTRAINT = 'unrelated_key';
    END $$ LANGUAGE plpgsql
  `);
  await connection.db.execute(sql`
    CREATE TRIGGER raise_unrelated_unique_violation BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION raise_unrelated_unique_violation()
  `);
}

async function insertRecordOnUserDelete() {
  await connection.db.execute(sql`
    CREATE FUNCTION insert_record_before_user_delete() RETURNS trigger AS $$
    BEGIN
      INSERT INTO study_records (user_id, record_date, timestamp, date_type, studied_minutes, fail_tags)
      VALUES (OLD.id, '2026-09-02', 0, 'weekday', '{1,0,0}', '{}');
      RETURN OLD;
    END $$ LANGUAGE plpgsql
  `);
  await connection.db.execute(sql`
    CREATE TRIGGER insert_record_before_user_delete BEFORE DELETE ON users
    FOR EACH ROW EXECUTE FUNCTION insert_record_before_user_delete()
  `);
}
