import {DateType} from '@/utils/service/constant/date-type';

export interface DailyStudyTime {
  pk: number;
  // user_id: string;
  date_type: DateType;
  studied_minutes: [number, number, number]; // 아점저 공부시간 (단위 : 분)
  fail_keywords: string[]; // 없으면 빈배열
  timestamp: number;
  wake_up_time: string | ''; // hh;mm
  bed_time: string | ''; // hh;mm
}

export type StudiedTimeCellMode = 'default' | 'sleep_time';
