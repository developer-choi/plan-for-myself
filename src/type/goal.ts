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
