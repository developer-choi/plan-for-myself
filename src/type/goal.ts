export interface Goal {
  pk: number //created timestamp
  title: string
  achievePrice: number //목표금액, 자연수만 가능 (음수 및 소수 불가능)
  notAchievePrice: number //목표달성실패 차감금액, 자연수만 가능
  frequency: GoalFrequency
  enableContinuous: boolean //목표의 연속 달성기능 활성화 여부
}

export interface CheckableGoal extends Goal {
  checked: boolean
}

export interface CheckedGoalHistory {
  checkedGoalList: CheckableGoal[]
  totalPrice: number //음수 가능
  createdTimestamp: number //오늘 체크한거, 저번달에 체크한거, 연속으로 체크했는지 계산할 때 활용
}

export type GoalFrequency = 'Daily' | 'Weekly' | 'Monthly'
