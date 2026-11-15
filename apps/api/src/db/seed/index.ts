import {getKoreanDate} from '@plan-for-myself/shared/date';
import {ImpossibleStateError} from '@plan-for-myself/shared/error';
import {eq, sql} from 'drizzle-orm';
import {drizzle} from 'drizzle-orm/node-postgres';
import {Pool} from 'pg';
import {studyRecords, users} from '../schema';
import {toRecordDate, toRecordTimestamp} from './date';
import {assertDevBranch} from './guard';
import {isScenarioName, SCENARIOS} from './scenario';

type SeedRow = Omit<typeof studyRecords.$inferInsert, 'pk' | 'userId'>;

const [scenarioName = '', googleSub] = process.argv.slice(2);
if (!isScenarioName(scenarioName) || !googleSub) {
  throw new Error(`사용법: yarn workspace api db:seed <${Object.keys(SCENARIOS).join('|')}> <google_sub>`);
}

const connectionString = process.env.POSTGRES_URL_NON_POOLING;
if (!connectionString) {
  throw new Error(
    'POSTGRES_URL_NON_POOLING이 비어 있어 시드를 넣지 않는다. apps/api/.env.local에 개발 DB 직접 연결 주소를 넣는다',
  );
}

const {year, month, date} = getKoreanDate();
const base = {year, month: month + 1, date};
const rows: SeedRow[] = SCENARIOS[scenarioName](base).map(({day, ...record}) => ({
  ...record,
  timestamp: toRecordTimestamp(day),
  recordDate: toRecordDate(day),
}));

/* 시나리오는 현재 날짜를 아직 기록하지 않은 상태를 만든다. 하한 날짜를 잘못 잡으면 현재 날짜 기록이 조용히 생겨 막는다 */
const baseDate = toRecordDate(base);
const notPastRow = rows.find((row) => row.recordDate >= baseDate);
if (notPastRow) {
  throw new Error(
    `${scenarioName} 시나리오가 현재 날짜(${baseDate}) 이후 기록(${notPastRow.recordDate})을 만들어 시드를 넣지 않는다`,
  );
}

replaceUserRecords(connectionString, googleSub, rows)
  .then(({userId, deletedCount, insertedCount}) => {
    process.stdout.write(
      `사용자 ${userId}: 기록 ${deletedCount}행을 지우고 ${scenarioName} 시나리오 ${insertedCount}행을 넣었다\n`,
    );
  })
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });

async function replaceUserRecords(connectionString: string, googleSub: string, rows: SeedRow[]) {
  const pool = new Pool({connectionString});
  const db = drizzle({client: pool});

  try {
    /* Neon이 아닌 DB(localhost 등)에는 이 설정이 없어 null이다 */
    const {
      rows: [branch],
    } = await db.execute<{branchId: string | null}>(sql`SELECT current_setting('neon.branch_id', true) AS "branchId"`);
    assertDevBranch(branch?.branchId ?? null);

    return await db.transaction(async (tx) => {
      await tx.insert(users).values({googleSub}).onConflictDoNothing({target: users.googleSub});
      const [user] = await tx.select({id: users.id}).from(users).where(eq(users.googleSub, googleSub));
      if (!user) {
        throw new ImpossibleStateError(`방금 넣거나 이미 있던 사용자(google_sub ${googleSub})를 찾지 못했다`);
      }

      const deleted = await tx.delete(studyRecords).where(eq(studyRecords.userId, user.id));
      const inserted =
        rows.length > 0 ? await tx.insert(studyRecords).values(rows.map((row) => ({...row, userId: user.id}))) : null;

      return {userId: user.id, deletedCount: deleted.rowCount ?? 0, insertedCount: inserted?.rowCount ?? 0};
    });
  } finally {
    await pool.end();
  }
}
