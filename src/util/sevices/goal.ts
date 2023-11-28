import type {Goal, GoalFrequency} from '@type/goal';
import {useQuery, useQueryClient} from 'react-query';
import {deleteGoal, getGoalFullResponse} from '@util/server/goal';
import {useForm} from 'react-hook-form';
import {useCallback} from 'react';

export const GOAL_FREQUENCY_LIST: GoalFrequency[] = ['Daily', 'Weekly', 'Monthly']
export const GOAL_RESPONSE_QUERY_KEY = ['goal-response']

export function useGoalResponse() {
  return useQuery({
    queryKey: GOAL_RESPONSE_QUERY_KEY,
    queryFn: getGoalFullResponse,
    staleTime: Infinity,
    cacheTime: Infinity
  })
}

type GoalFrequencyWithAll = GoalFrequency | 'All'
const ALL_GOAL_FREQUENCY_LIST: GoalFrequencyWithAll[] = ['All', ...GOAL_FREQUENCY_LIST]

interface FilteredGoalFormData {
  frequency: GoalFrequencyWithAll
}

export function useTotalGoalList(goalList: Goal[]) {
  const {register, watch, } = useForm<FilteredGoalFormData>({
    defaultValues: {
      frequency: 'All'
    }
  });

  const currentFrequency = watch('frequency')

  return {
    radioPropsList: ALL_GOAL_FREQUENCY_LIST.map(frequency => ({
      ...register('frequency'),
      value: frequency,
    })),
    filteredGoalList: currentFrequency === 'All' ? goalList : goalList.filter(goal => goal.frequency === currentFrequency)
  }
}

export function useDeleteGoal() {
  const queryClient = useQueryClient();
  
  return useCallback((goal: Goal) => {
    if (confirm('삭제하시겠습니까?')) {
      deleteGoal(goal)
      queryClient.invalidateQueries(GOAL_RESPONSE_QUERY_KEY)
    }
  }, [queryClient])
}
