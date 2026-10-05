import type {DateType, StudyRecord} from '@plan-for-myself/shared';

interface TestRecordOptions {
  failTags?: string[];
  dateType?: DateType;
  minutes?: {morning?: number; afternoon?: number; evening?: number};
}

export function createTestRecord(
  date: string,
  {failTags = [], dateType = 'weekday', minutes = {}}: TestRecordOptions = {},
): StudyRecord {
  const {morning = 0, afternoon = 0, evening = 0} = minutes;
  return {pk: 0, date, dateType, studiedMinutes: [morning, afternoon, evening], failTags};
}
