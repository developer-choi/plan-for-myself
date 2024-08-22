import type {Goal, GoalFrequency} from '@/types/goal';
import {useForm} from 'react-hook-form';
import {useCallback} from 'react';
import {deleteGoalApi} from '@/utils/service/api/goal';

export const GOAL_FREQUENCY_LIST: GoalFrequency[] = ['Daily', 'Weekly', 'Monthly'];

type GoalFrequencyWithAll = GoalFrequency | 'All'
const ALL_GOAL_FREQUENCY_LIST: GoalFrequencyWithAll[] = ['All', ...GOAL_FREQUENCY_LIST];

interface FilteredGoalFormData {
  frequency: GoalFrequencyWithAll;
}

export function useTotalGoalList(goalList: Goal[], todayFrequency: GoalFrequency) {
  const {register, watch,} = useForm<FilteredGoalFormData>({
    defaultValues: {
      frequency: todayFrequency
    }
  });

  const currentFrequency = watch('frequency');

  return {
    currentFrequency: watch('frequency'),
    radioPropsList: ALL_GOAL_FREQUENCY_LIST.map(frequency => ({
      ...register('frequency'),
      value: frequency,
    })),
    filteredGoalList: currentFrequency === 'All' ? goalList : goalList.filter(goal => goal.frequency === currentFrequency)
  };
}

export function useDeleteGoal() {
  return useCallback(async (goal: Goal) => {
    if (confirm(`${goal.title.slice(0, 10)}...을 삭제하시겠습니까?`)) {
      try {
        await deleteGoalApi(goal.pk);
        // queryClient.invalidateQueries(GOAL_FULL_RESPONSE_QUERY_KEY);
      } catch (error) {
        alert('삭제 실패!' + JSON.stringify(error));
        console.error(error);
      }
    }
  }, []);
}
