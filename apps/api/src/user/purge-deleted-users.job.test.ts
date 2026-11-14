import {DELETION_GRACE_DAYS} from '@plan-for-myself/shared/auth';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import {createDatabaseConnection, type DatabaseConnection} from '../db/database';
import {findDeletedAt, insertGoogleUser} from '../testing/users';
import {PurgeDeletedUsersJob} from './purge-deleted-users.job';
import {UserRepository} from './user.repository';

describe('PurgeDeletedUsersJob', () => {
  let connection: DatabaseConnection;
  let repository: UserRepository;
  let job: PurgeDeletedUsersJob;

  beforeEach(async () => {
    vi.useFakeTimers({toFake: ['Date']});
    connection = await createDatabaseConnection({});
    repository = new UserRepository(connection.db);
    job = new PurgeDeletedUsersJob(repository);
    return async () => {
      vi.useRealTimers();
      await connection.close();
    };
  });

  describe('run()', () => {
    describe('General cases', () => {
      it('유예 기간이 지난 탈퇴 계정을 지워야 한다', async () => {
        const userId = await insertGoogleUser(connection.db, 'expired-sub');
        vi.setSystemTime(daysBeforeNow(DELETION_GRACE_DAYS + 1));
        await repository.markDeleted(userId);
        vi.setSystemTime(NOW);

        await job.run();

        expect(await findDeletedAt(connection.db, userId)).toBeUndefined();
      });
    });

    describe('Boundary cases', () => {
      it('탈퇴한 지 정확히 유예 기간만큼 지난 계정은 남겨야 한다', async () => {
        const userId = await insertGoogleUser(connection.db, 'pending-sub');
        vi.setSystemTime(daysBeforeNow(DELETION_GRACE_DAYS));
        await repository.markDeleted(userId);
        vi.setSystemTime(NOW);

        await job.run();

        expect(await findDeletedAt(connection.db, userId)).toEqual(daysBeforeNow(DELETION_GRACE_DAYS));
      });
    });
  });
});

const NOW = new Date('2026-10-20T00:00:00Z');
const MILLISECONDS_PER_DAY = 86_400_000;

function daysBeforeNow(days: number) {
  return new Date(NOW.getTime() - days * MILLISECONDS_PER_DAY);
}
