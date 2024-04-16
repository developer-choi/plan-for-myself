import type {CheckedGoalHistory, Goal} from '@type/goal';

export type PostGoalRequestParameter = Omit<Goal, 'pk' | 'notAchievePrice'> & Partial<Pick<Goal, 'notAchievePrice'>>

export interface GoalFullResponse {
  goalList: Goal[]
  checkedGoalHistoryList: CheckedGoalHistory[] // 최근께 먼저나오게. 즉 추가할 때마다 push하지말고 맨앞에 끼워넣어야.
  hasCheckedToday: boolean
  todayCheckGoalList: Goal[] //매일 체크리스트 보여주는데만 사용. 나머지 모든 계산은 history로 진행.
}
