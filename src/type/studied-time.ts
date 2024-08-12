/**
 * full = 주말, 휴일, 연차 등 하루종일 공부할 수 있었던 날
 * quartar = 평일, 학교, 회사 다녀오느라 공부 하루종일못했던 날
 */
export type DailyStudyTimeDateType = 'quarter' | 'full';

export interface DailyStudyTime {
  pk: number;
  // user_id: string;
  studied_minutes: [number, number, number]; // 아점저 공부시간 (단위 : 분)
  fail_keywords: string[]; // 없으면 빈배열
  fail_reason: string | undefined;
  date_type: DailyStudyTimeDateType;
  timestamp: number;
}

export type PostDailyStudyTimeParameter = Omit<DailyStudyTime, 'pk' | 'timestamp'>;
