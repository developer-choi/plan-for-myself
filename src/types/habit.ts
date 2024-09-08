export interface Habit {
  pk: number; //created timestamp
  title: string;
  achieve_price: number; //습관 달성금액, 자연수만 가능 (음수 및 소수 불가능)
  content: string; // TODO 곧 memo같은걸로 수정예정
  not_achieve_price: number; //습관 달성실패 차감금액, 자연수만 가능
  frequency: HabitFrequency;
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

export type HabitFrequency = 'Daily' | 'Weekly' | 'Monthly'

export interface HabitFullResponse {
  originalHabitList: Habit[];
  todayHistory: {
    checked_timestamp: number | undefined;
    has_checked: boolean;
    checked_list: CheckableHabit[];
    total_price: number; // 음수 가능
  };
  todayFrequency: HabitFrequency;
  todayHabitList: Habit[]; // 오늘 체크할 습관 목록. 평일이면 Daily꺼만, 주말이면 Weekly 포함. 매일 체크리스트 보여주는데만 사용하면됨.
}
