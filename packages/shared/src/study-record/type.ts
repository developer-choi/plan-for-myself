import type {DateType} from '../date-type/type';

export interface StudyRecord {
  pk: number;
  date: string;
  dateType: DateType;
  studiedMinutes: [morning: number, afternoon: number, evening: number];
  failTags: string[];
}

export interface StudyRecordOverview {
  date: string;
  /* 요청한 날짜까지 기록이 하나도 없으면 null */
  firstRecordDate: string | null;
  streak: {current: number; longest: number};
  totals: {recordedDays: number; studiedMinutes: number; improvedFailures: number};
}
