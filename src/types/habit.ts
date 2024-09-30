import {DailyStudyTimeDateType} from '@/types/studied-time';

export interface Habit {
  pk: number; //created timestamp
  title: string;
  memo: string;
  frequency_list: HabitFrequency[];
  children: SubHabit[];
  has_important: boolean;
}

// 네이밍 고민중
export interface SubHabit {
  title: string;
  is_important: boolean;
}

export interface CheckableHabitSubItem extends SubHabit {
  checked: boolean;
}

export interface CheckableHabit extends Habit {
  children: CheckableHabitSubItem[];
}

export type HabitFrequency = DailyStudyTimeDateType;

export interface HabitFullResponse {
  originalHabitList: Habit[];
  todayHistory: {
    checked_timestamp: number | undefined;
    has_checked: boolean;
    checked_list: CheckableHabit[];
  };
  todayFrequency: HabitFrequency;
  todayHabitList: Habit[]; // 오늘 체크할 습관 목록. 평일이면 Daily꺼만, 주말이면 Weekly 포함. 매일 체크리스트 보여주는데만 사용하면됨.
}
