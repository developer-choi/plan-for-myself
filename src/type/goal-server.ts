import type {CheckableGoal, Goal, GoalFrequency} from '@type/goal';

export type PostGoalRequestParameter = Omit<Goal, 'pk' | 'notAchievePrice'> & Partial<Pick<Goal, 'notAchievePrice'>>;

export interface GoalFullResponse {
  originalGoalList: Goal[];
  todayHistory: {
    checkedTimestamp: number | undefined;
    hasChecked: boolean;
    checkedList: CheckableGoal[];
    totalPrice: number; // 음수 가능
  };
  todayFrequency: GoalFrequency;
  todayGoalList: Goal[]; // 오늘 체크할 목표 목록. 평일이면 Daily꺼만, 주말이면 Weekly 포함. 매일 체크리스트 보여주는데만 사용하면됨.
}
