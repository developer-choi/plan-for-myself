import {beforeEach, describe, expect, it} from 'vitest';
import {createDatabaseConnection, type DatabaseConnection} from './database';
import {users} from './schema';

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
