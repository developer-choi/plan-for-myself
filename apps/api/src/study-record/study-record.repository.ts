import {Inject, Injectable} from '@nestjs/common';
import {ImpossibleStateError} from '@plan-for-myself/shared/error';
import type {MonthRange, NewStudyRecord, StudyRecord, StudyRecordFields} from '@plan-for-myself/shared/study-record';
import {and, asc, eq, gte, lt, sql} from 'drizzle-orm';
import type {Database} from '../db/database';
import {DATABASE} from '../db/database.module';
import {POSTGRES_ERROR_CODES, readPostgresError} from '../db/postgres-error';
import {studyRecords} from '../db/schema';

type CreateResult = {ok: true; record: StudyRecord} | {ok: false; reason: 'DUPLICATE_DATE' | 'USER_NOT_FOUND'};

@Injectable()
export class StudyRecordRepository {
  constructor(@Inject(DATABASE) private readonly db: Database) {}

  list(userId: number, range: MonthRange | null): Promise<StudyRecord[]> {
    return this.db
      .select(COLUMNS)
      .from(studyRecords)
      .where(
        and(
          eq(studyRecords.userId, userId),
          range ? gte(studyRecords.recordDate, range.from) : undefined,
          range ? lt(studyRecords.recordDate, range.until) : undefined,
        ),
      )
      .orderBy(asc(studyRecords.recordDate));
  }

  async create(userId: number, record: NewStudyRecord): Promise<CreateResult> {
    try {
      const [created] = await this.db
        .insert(studyRecords)
        .values({
          userId,
          recordDate: record.date,
          timestamp: sql`(extract(epoch FROM (${record.date}::date + time '13:00') AT TIME ZONE 'Asia/Seoul') * 1000)::bigint`,
          dateType: record.dateType,
          studiedMinutes: record.studiedMinutes,
          failTags: record.failTags,
        })
        .returning(COLUMNS);
      if (!created) {
        throw new ImpossibleStateError('기록을 넣었는데 돌아온 행이 없다');
      }
      return {ok: true, record: created};
    } catch (error) {
      const postgresError = readPostgresError(error);
      if (
        postgresError?.code === POSTGRES_ERROR_CODES.UNIQUE_VIOLATION &&
        postgresError.constraint === DUPLICATE_DATE_CONSTRAINT
      ) {
        return {ok: false, reason: 'DUPLICATE_DATE'};
      }
      if (postgresError?.code === POSTGRES_ERROR_CODES.FOREIGN_KEY_VIOLATION) {
        return {ok: false, reason: 'USER_NOT_FOUND'};
      }
      throw error;
    }
  }

  /**
   * null: 그 pk의 기록이 없거나 다른 사용자의 기록이다
   */
  async update(target: {userId: number; pk: number}, fields: StudyRecordFields): Promise<StudyRecord | null> {
    const [updated] = await this.db
      .update(studyRecords)
      .set({dateType: fields.dateType, studiedMinutes: fields.studiedMinutes, failTags: fields.failTags})
      .where(and(eq(studyRecords.pk, target.pk), eq(studyRecords.userId, target.userId)))
      .returning(COLUMNS);
    return updated ?? null;
  }

  async delete(target: {userId: number; pk: number}): Promise<boolean> {
    const deleted = await this.db
      .delete(studyRecords)
      .where(and(eq(studyRecords.pk, target.pk), eq(studyRecords.userId, target.userId)))
      .returning({pk: studyRecords.pk});
    return deleted.length > 0;
  }
}

const COLUMNS = {
  pk: studyRecords.pk,
  date: studyRecords.recordDate,
  dateType: studyRecords.dateType,
  studiedMinutes: studyRecords.studiedMinutes,
  failTags: studyRecords.failTags,
};

const DUPLICATE_DATE_CONSTRAINT = 'study_records_user_id_record_date_key';
