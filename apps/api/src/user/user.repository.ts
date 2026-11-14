import {Inject, Injectable} from '@nestjs/common';
import {ImpossibleStateError} from '@plan-for-myself/shared/error';
import {and, eq, exists, inArray, isNull, lt, notExists, sql} from 'drizzle-orm';
import {alias} from 'drizzle-orm/pg-core';
import type {Database} from '../db/database';
import {DATABASE} from '../db/database.module';
import {POSTGRES_ERROR_CODES, type PostgresErrorFields, readPostgresError} from '../db/postgres-error';
import {studyRecords, users} from '../db/schema';

export interface UserRow {
  id: number;
  isGuest: boolean;
}

interface GoogleLoginRows {
  isStillGuest: boolean;
  guestHasRecords: boolean;
  /** null: 이 Google 계정으로 가입된 사용자가 없다 */
  registeredUserId: number | null;
}

/* Pool의 query_timeout과 Drizzle 트랜잭션을 함께 사용하면 시간이 지난 연결이 풀로 돌아가, 쓰기를 트랜잭션 없이 SQL 한 문장씩 한다 */
@Injectable()
export class UserRepository {
  constructor(@Inject(DATABASE) private readonly db: Database) {}

  /**
   * null: 그 번호의 사용자 행이 없거나 탈퇴 표시가 됐다
   */
  async findById(id: number): Promise<UserRow | null> {
    const [row] = await this.db
      .select({id: users.id, isGuest: users.isGuest})
      .from(users)
      .where(and(eq(users.id, id), isNull(users.deletedAt)));
    return row ?? null;
  }

  async findGoogleLoginRows(guestUserId: number, googleSub: string): Promise<GoogleLoginRows> {
    const registered = alias(users, 'registered');
    const [row] = await this.db
      .select({
        isStillGuest: exists(this.selectGuest(guestUserId)).mapWith(Boolean),
        guestHasRecords: exists(this.selectRecordsOf(guestUserId)).mapWith(Boolean),
        registeredUserId: registered.id,
      })
      .from(sql`(SELECT 1) AS one_row`)
      .leftJoin(registered, eq(registered.googleSub, googleSub));
    if (!row) {
      throw new ImpossibleStateError('FROM 절이 한 행인 조회가 행을 돌려주지 않았다');
    }
    return row;
  }

  async createGuest(): Promise<number> {
    const [row] = await this.db.insert(users).values({isGuest: true}).returning({id: users.id});
    if (!row) {
      throw new ImpossibleStateError('게스트를 넣었는데 돌아온 행이 없다');
    }
    return row.id;
  }

  async findOrCreateByGoogleSub(googleSub: string): Promise<number> {
    const [row] = await this.db
      .insert(users)
      .values({googleSub})
      .onConflictDoUpdate({target: users.googleSub, set: {deletedAt: null}})
      .returning({id: users.id});
    if (!row) {
      throw new ImpossibleStateError('ON CONFLICT DO UPDATE ... RETURNING이 행을 돌려주지 않았다');
    }
    return row.id;
  }

  async restore(id: number): Promise<boolean> {
    const restored = await this.db
      .update(users)
      .set({deletedAt: null})
      .where(eq(users.id, id))
      .returning({id: users.id});
    return restored.length > 0;
  }

  linkGuestToGoogle(guestUserId: number, googleSub: string): Promise<boolean> {
    /* users_is_guest_matches_google_sub 제약 때문에 google_sub와 is_guest를 함께 바꿔야 한다 */
    return this.writeUnlessRaced(
      this.db
        .update(users)
        .set({googleSub, isGuest: false})
        .where(and(eq(users.id, guestUserId), eq(users.isGuest, true)))
        .returning({id: users.id}),
    );
  }

  deleteGuestWithRecords(guestUserId: number): Promise<boolean> {
    /* 잠그지 않으면 같은 게스트를 Google 계정으로 바꾸는 요청이 먼저 커밋됐을 때, 막 Google 계정이 된 사용자 행과 기록을 지운다 */
    const target = this.db.$with('target').as(this.selectGuest(guestUserId).for('update'));
    const targetIds = this.db.select({id: target.id}).from(target);
    const deletedRecords = this.db
      .$with('deleted_records')
      .as(this.db.delete(studyRecords).where(inArray(studyRecords.userId, targetIds)));
    return this.writeUnlessRaced(
      this.db.with(target, deletedRecords).delete(users).where(inArray(users.id, targetIds)).returning({id: users.id}),
    );
  }

  deleteGuestWithoutRecords(guestUserId: number): Promise<boolean> {
    return this.writeUnlessRaced(
      this.db
        .delete(users)
        .where(and(eq(users.id, guestUserId), eq(users.isGuest, true), notExists(this.selectRecordsOf(guestUserId))))
        .returning({id: users.id}),
    );
  }

  async markDeleted(id: number): Promise<void> {
    await this.db
      .update(users)
      .set({deletedAt: new Date()})
      .where(and(eq(users.id, id), isNull(users.deletedAt)));
  }

  async purgeDeletedUsers(before: Date): Promise<number> {
    /* 잠그지 않으면 같은 순간 Google 재로그인이 탈퇴 표시를 지운 사용자 행과 기록을 지운다 */
    const target = this.db
      .$with('target')
      .as(this.db.select({id: users.id}).from(users).where(lt(users.deletedAt, before)).for('update'));
    const targetIds = this.db.select({id: target.id}).from(target);
    /* study_records.user_id FK에 ON DELETE CASCADE가 없어 기록을 함께 지워야 사용자 행을 지울 수 있다 */
    const deletedRecords = this.db
      .$with('deleted_records')
      .as(this.db.delete(studyRecords).where(inArray(studyRecords.userId, targetIds)));
    const deleted = await this.db
      .with(target, deletedRecords)
      .delete(users)
      .where(inArray(users.id, targetIds))
      .returning({id: users.id});
    return deleted.length;
  }

  private async writeUnlessRaced(write: Promise<unknown[]>): Promise<boolean> {
    try {
      return (await write).length > 0;
    } catch (error) {
      if (isRaceViolation(readPostgresError(error))) {
        return false;
      }
      throw error;
    }
  }

  private selectGuest(userId: number) {
    return this.db
      .select({id: users.id})
      .from(users)
      .where(and(eq(users.id, userId), eq(users.isGuest, true)));
  }

  private selectRecordsOf(userId: number) {
    return this.db
      .select({one: sql`1`})
      .from(studyRecords)
      .where(eq(studyRecords.userId, userId));
  }
}

const RACE_VIOLATIONS = [
  {code: POSTGRES_ERROR_CODES.UNIQUE_VIOLATION, constraint: 'users_google_sub_key'},
  {code: POSTGRES_ERROR_CODES.FOREIGN_KEY_VIOLATION, constraint: 'study_records_user_id_fkey'},
];

/**
 * @param fields null: 던져진 오류가 Postgres 오류가 아니다
 */
function isRaceViolation(fields: PostgresErrorFields | null): boolean {
  return RACE_VIOLATIONS.some(({code, constraint}) => fields?.code === code && fields.constraint === constraint);
}
