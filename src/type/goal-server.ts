import type {CheckedGoalHistory, ContinuousGoalHistory, Goal} from '@type/goal';

export type PostGoalRequestParameter = Omit<Goal, 'pk' | 'notAchievePrice'> & Partial<Pick<Goal, 'notAchievePrice'>>

export interface GoalResponse {
  goalList: Goal[] //매일 체크리스트 보여주는데만 사용. 나머지 모든 계산은 history로 진행.
  checkedGoalHistoryList: CheckedGoalHistory[] // 최근께 먼저나오게. 즉 추가할 때마다 push하지말고 맨앞에 끼워넣어야.
  continuousGoalHistory: ContinuousGoalHistory | undefined // 과거에 저장당시 기준으로 연속달성했던 목표를 저장 (= 현재 시점에서도 연속달성이 아닐 수도 있음)
  accumulateGoalRate: number // 과거 저장당시 기준으로 목표달성률을 저장
  hasCheckedToday: boolean
}
