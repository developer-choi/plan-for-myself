import type {Goal, GoalFrequency} from '@/type/goal';
import {useQuery, useQueryClient} from 'react-query';
import {useForm} from 'react-hook-form';
import {useCallback} from 'react';
import {GoalFullResponse} from '@/type/goal';
import {deleteGoalApi, getGoalListApi} from '@/util/sevices/api/goal';

export const GOAL_FREQUENCY_LIST: GoalFrequency[] = ['Daily', 'Weekly', 'Monthly'];
export const GOAL_FULL_RESPONSE_QUERY_KEY = ['goal-full-response'];

export function useGoalResponse() {
  return useQuery({
    queryKey: GOAL_FULL_RESPONSE_QUERY_KEY,
    queryFn: async () => {
      const {json} = await getGoalListApi();

      const goalFullResponse: GoalFullResponse = {
        originalGoalList: json.originalGoalList,
        todayFrequency: 'Daily',
        todayGoalList: json.originalGoalList,
        todayHistory: json.todayHistory ?? {
          has_checked: false,
          checked_list: [],
          checked_timestamp: undefined,
          total_price: 0
        }
      };

      return goalFullResponse;
    },
    staleTime: Infinity,
    cacheTime: Infinity
  });
}

type GoalFrequencyWithAll = GoalFrequency | 'All'
const ALL_GOAL_FREQUENCY_LIST: GoalFrequencyWithAll[] = ['All', ...GOAL_FREQUENCY_LIST];

interface FilteredGoalFormData {
  frequency: GoalFrequencyWithAll;
}

export function useTotalGoalList(goalList: Goal[]) {
  const {data} = useGoalResponse();
  const {register, watch,} = useForm<FilteredGoalFormData>({
    defaultValues: {
      frequency: data?.todayFrequency ?? 'All'
    }
  });

  const currentFrequency = watch('frequency');

  return {
    frequency: watch('frequency'),
    radioPropsList: ALL_GOAL_FREQUENCY_LIST.map(frequency => ({
      ...register('frequency'),
      value: frequency,
    })),
    filteredGoalList: currentFrequency === 'All' ? goalList : goalList.filter(goal => goal.frequency === currentFrequency)
  };
}

export function useDeleteGoal() {
  const queryClient = useQueryClient();

  return useCallback(async (goal: Goal) => {
    if (confirm(`${goal.title.slice(0, 10)}...을 삭제하시겠습니까?`)) {
      try {
        await deleteGoalApi(goal.pk);
        queryClient.invalidateQueries(GOAL_FULL_RESPONSE_QUERY_KEY);
      } catch (error) {
        alert('삭제 실패!' + JSON.stringify(error));
        console.error(error);
      }
    }
  }, [queryClient]);
}
