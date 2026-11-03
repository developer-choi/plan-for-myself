import type {FailureTag, StudyRecord, StudyRecordMonthly} from '@plan-for-myself/shared';

interface MonthlyOverrides extends Partial<Omit<StudyRecordMonthly, 'study'>> {
  study?: Partial<StudyRecordMonthly['study']>;
}

export function createMonthly({study, ...overrides}: MonthlyOverrides = {}): StudyRecordMonthly {
  return {
    month: '2026-10',
    inProgress: true,
    recordedDays: {count: 21, total: 23},
    failureTags: [],
    ...overrides,
    study: {totalMinutes: 4080, weekdayAvg: 189, holidayAvg: 212, prevWeekdayAvg: 176, prevHolidayAvg: 244, ...study},
  };
}

export function createFailureTag(overrides: Partial<FailureTag> = {}): FailureTag {
  return {tag: '늦잠', count: 3, previousCount: 2, status: 'repeated', trend: [], ...overrides};
}

export function createStudyRecord(overrides: Partial<StudyRecord> = {}): StudyRecord {
  return {pk: 1, date: '2026-09-01', dateType: 'weekday', studiedMinutes: [0, 0, 0], failTags: [], ...overrides};
}
