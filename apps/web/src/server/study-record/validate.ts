import {z} from 'zod';

export type NewStudyRecord = z.infer<typeof newStudyRecordSchema>;
export type StudyRecordFields = z.infer<typeof studyRecordFieldsSchema>;

export interface Rejection {
  code:
    | 'INVALID_BODY'
    | 'INVALID_DATE'
    | 'INVALID_MONTH'
    | 'INVALID_DATE_TYPE'
    | 'INVALID_STUDIED_MINUTES'
    | 'INVALID_FAIL_TAGS';
  message: string;
}

export type Validation<T> = {ok: true; value: T} | {ok: false; rejection: Rejection};

export function validateNewStudyRecord(body: unknown, today: string): Validation<NewStudyRecord> {
  const result = validate(newStudyRecordSchema, body);
  if (result.ok && result.value.date > today) {
    return {ok: false, rejection: {code: 'INVALID_DATE', message: FUTURE_DATE_MESSAGE}};
  }
  return result;
}

export function validateStudyRecordUpdate(body: unknown): Validation<StudyRecordFields> {
  return validate(studyRecordUpdateSchema, body);
}

export function validateDate(date: string | null): Validation<string> {
  const result = dateSchema.safeParse(date);
  return result.success
    ? {ok: true, value: result.data}
    : {ok: false, rejection: {code: 'INVALID_DATE', message: result.error.issues[0].message}};
}

export function validateMonth(month: string | null): Validation<{from: string; until: string}> {
  const result = monthSchema.safeParse(month);
  return result.success
    ? {ok: true, value: result.data}
    : {ok: false, rejection: {code: 'INVALID_MONTH', message: result.error.issues[0].message}};
}

/* JSON이 깨진 본문만 undefined로 돌려 INVALID_BODY로 거절하게 하고, 그 밖의 읽기 실패는 그대로 던진다 */
export async function readJsonBody(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch (error) {
    if (error instanceof SyntaxError) {
      return undefined;
    }
    throw error;
  }
}

/* 숫자가 아니거나 int 범위를 넘는 pk는 어느 기록도 가리키지 않으므로 null로 돌려 404로 답하게 한다 */
export function parsePk(value: string): number | null {
  const result = pkSchema.safeParse(value);
  return result.success ? result.data : null;
}

const STUDY_RECORD_LIMITS = {
  studiedMinutes: {min: 0, max: 1440},
  failTags: {maxCount: 2},
  /* Postgres int */
  pk: {max: 2147483647},
  /* Postgres date는 0년을 받지 못하고, 9999-12의 다음 달은 해가 다섯 자리라 DB가 날짜로 받지 못한다 */
  date: {min: '1000-01-01', max: '9998-12-31'},
};

const DATE_MESSAGE = '날짜가 올바르지 않아요';
const MONTH_MESSAGE = '조회할 달이 올바르지 않아요';
const FUTURE_DATE_MESSAGE = '오늘과 지난 날짜만 기록할 수 있어요';
const STUDIED_MINUTES_MESSAGE = `공부시간은 ${STUDY_RECORD_LIMITS.studiedMinutes.min}~${STUDY_RECORD_LIMITS.studiedMinutes.max} 사이의 숫자로 적어 주세요`;

const minutesSchema = z
  .number({error: STUDIED_MINUTES_MESSAGE})
  .int({error: STUDIED_MINUTES_MESSAGE})
  .min(STUDY_RECORD_LIMITS.studiedMinutes.min, {error: STUDIED_MINUTES_MESSAGE})
  .max(STUDY_RECORD_LIMITS.studiedMinutes.max, {error: STUDIED_MINUTES_MESSAGE});

const failTagSchema = z
  .string({error: '실패 태그는 글자로 적어 주세요'})
  .min(1, {error: '빈 실패 태그는 넣을 수 없어요'})
  .regex(/^\S+$/, {error: '실패 태그에는 공백을 넣을 수 없어요'});

const dateSchema = z.iso
  .date({error: DATE_MESSAGE})
  .refine((date) => date >= STUDY_RECORD_LIMITS.date.min && date <= STUDY_RECORD_LIMITS.date.max, {
    error: DATE_MESSAGE,
  });

const studyRecordOriginalSchema = z.object({
  date: dateSchema,
  dateType: z.enum(['weekday', 'holiday'], {error: '평일·휴일 중 하나를 골라 주세요'}),
  studiedMinutes: z.tuple([minutesSchema, minutesSchema, minutesSchema], {error: STUDIED_MINUTES_MESSAGE}),
  failTags: z
    .array(failTagSchema, {error: '실패 태그 목록이 올바르지 않아요'})
    .max(STUDY_RECORD_LIMITS.failTags.maxCount, {
      error: `실패 태그는 ${STUDY_RECORD_LIMITS.failTags.maxCount}개까지예요`,
    }),
});

const newStudyRecordSchema = studyRecordOriginalSchema;
const studyRecordFieldsSchema = studyRecordOriginalSchema.pick({
  dateType: true,
  studiedMinutes: true,
  failTags: true,
});
const studyRecordUpdateSchema = studyRecordFieldsSchema.extend({
  date: z.never({error: '날짜는 바꿀 수 없어요. 지우고 그 날짜에 새로 기록해 주세요'}).optional(),
});

const monthSchema = z
  .string({error: MONTH_MESSAGE})
  .regex(/^\d{4}-(0[1-9]|1[0-2])$/, {error: MONTH_MESSAGE})
  .refine(
    (month) =>
      month >= STUDY_RECORD_LIMITS.date.min.slice(0, MONTH_LENGTH) &&
      month <= STUDY_RECORD_LIMITS.date.max.slice(0, MONTH_LENGTH),
    {error: MONTH_MESSAGE},
  )
  .transform((month) => {
    const [year, monthNumber] = month.split('-').map(Number);
    return {from: `${month}-01`, until: new Date(Date.UTC(year, monthNumber, 1)).toISOString().slice(0, DATE_LENGTH)};
  });

const pkSchema = z
  .string()
  .regex(/^\d+$/, {error: 'pk는 숫자여야 해요'})
  .transform(Number)
  .pipe(z.number().int().positive().max(STUDY_RECORD_LIMITS.pk.max, {error: 'pk가 범위를 넘었어요'}));

const DATE_LENGTH = 'YYYY-MM-DD'.length;
const MONTH_LENGTH = 'YYYY-MM'.length;

const REJECTION_CODES: Record<keyof z.infer<typeof studyRecordOriginalSchema>, Rejection['code']> = {
  date: 'INVALID_DATE',
  dateType: 'INVALID_DATE_TYPE',
  studiedMinutes: 'INVALID_STUDIED_MINUTES',
  failTags: 'INVALID_FAIL_TAGS',
};

function validate<T>(schema: z.ZodType<T>, body: unknown): Validation<T> {
  const result = schema.safeParse(body);
  if (result.success) {
    return {ok: true, value: result.data};
  }

  const [issue] = result.error.issues;
  const field = issue.path[0];
  if (isRecordField(field)) {
    return {ok: false, rejection: {code: REJECTION_CODES[field], message: issue.message}};
  }
  return {ok: false, rejection: {code: 'INVALID_BODY', message: '요청 형식이 올바르지 않아요'}};
}

function isRecordField(field: PropertyKey | undefined): field is keyof typeof REJECTION_CODES {
  return typeof field === 'string' && Object.hasOwn(REJECTION_CODES, field);
}
