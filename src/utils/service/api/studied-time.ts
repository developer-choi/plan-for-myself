import {DailyStudyTime} from '@/types/studied-time';

export interface PostDailyStudyTimeParameter extends Omit<DailyStudyTime, 'pk' | 'timestamp'> {
  year: number;
  month: number;
  date: number;
}

export type UpdateDailyStudyTimeParameter = DailyStudyTime;
