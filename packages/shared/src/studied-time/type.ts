import type {DateType} from '../date-type/type';

export interface DailyStudyTime {
  pk: number;
  date_type: DateType;
  studied_minutes: [morning: number, afternoon: number, evening: number];
  fail_keywords: string[];
  timestamp: number;
}
