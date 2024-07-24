import type {CheckableGoal, Goal, GoalFrequency} from '@/type/goal';

export type PostGoalRequestParameter = Omit<Goal, 'pk' | 'not_achieve_price' | 'is_important'> & Partial<Pick<Goal, 'not_achieve_price'>>;

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
