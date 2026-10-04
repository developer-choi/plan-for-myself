import type {StudyRecord} from '@plan-for-myself/shared';

export function sumMinutes(record: StudyRecord) {
  return record.studiedMinutes.reduce((sum, minutes) => sum + minutes, 0);
}
