import type {DateType} from '../date-type/type';

export interface StudyRecord {
  pk: number;
  date_type: DateType;
  studied_minutes: [morning: number, afternoon: number, evening: number];
  fail_tags: string[];
  timestamp: number;
}
