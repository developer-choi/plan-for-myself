export interface Goal {
  pk: number; //created timestamp
  title: string;
  achieve_price: number; //목표금액, 자연수만 가능 (음수 및 소수 불가능)
  content: string;
  not_achieve_price: number; //목표달성실패 차감금액, 자연수만 가능
  frequency: GoalFrequency;
  is_important: boolean;
}

export interface CheckableGoal extends Goal {
  checked: boolean;
}

export type GoalFrequency = 'Daily' | 'Weekly' | 'Monthly'

export interface GoalFullResponse {
  originalGoalList: Goal[];
  todayHistory: {
    checked_timestamp: number | undefined;
    has_checked: boolean;
    checked_list: CheckableGoal[];
    total_price: number; // 음수 가능
  };
  todayFrequency: GoalFrequency;
  todayGoalList: Goal[]; // 오늘 체크할 목표 목록. 평일이면 Daily꺼만, 주말이면 Weekly 포함. 매일 체크리스트 보여주는데만 사용하면됨.
}
