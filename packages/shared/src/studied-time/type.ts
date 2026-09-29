import type {DateType} from '../date-type/type';

export interface DailyStudyTime {
  pk: number;
  // user_id: string;
  date_type: DateType;
  studied_minutes: [morning: number, afternoon: number, evening: number];
  fail_keywords: string[]; // 없으면 빈배열
  timestamp: number;
}
