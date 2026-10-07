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

export interface StudyRecordMonthly {
  month: string;
  inProgress: boolean;
  recordedDays: RecordedDays;
  /* 기록이 하나도 없거나 전달이 첫 기록이 있는 달보다 앞이면 셀 대상이 아니라 null. 첫 기록 뒤 통째로 쉰 달은 count 0이다 */
  previousRecordedDays: RecordedDays | null;
  study: {
    totalMinutes: number;
    /* 조회하는 달에 평일 기록이 없으면 null */
    weekdayAvg: number | null;
    /* 조회하는 달에 휴일 기록이 없으면 null */
    holidayAvg: number | null;
    /* 전달에 평일 기록이 없으면 null (전달이 첫 기록 달보다 앞인 경우 포함) */
    prevWeekdayAvg: number | null;
    /* 전달에 휴일 기록이 없으면 null (전달이 첫 기록 달보다 앞인 경우 포함) */
    prevHolidayAvg: number | null;
  };
  failureTags: FailureTag[];
}

export type FailureTagStatus = 'repeated' | 'appeared' | 'reduced';

export interface FailureTag {
  tag: string;
  count: number;
  previousCount: number;
  status: FailureTagStatus;
}

export interface RecordedDays {
  count: number;
  total: number;
}
