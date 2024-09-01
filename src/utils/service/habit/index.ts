import type {Habit, HabitFrequency} from '@/types/habit';
import {useForm} from 'react-hook-form';
import {useCallback} from 'react';
import {deleteHabitApi} from '@/utils/service/api/habit';

export const HABIT_FREQUENCY_LIST: HabitFrequency[] = ['Daily', 'Weekly', 'Monthly'];

type HabitFrequencyWithAll = HabitFrequency | 'All'
const ALL_HABIT_FREQUENCY_LIST: HabitFrequencyWithAll[] = ['All', ...HABIT_FREQUENCY_LIST];

interface FilteredHabitFormData {
  frequency: HabitFrequencyWithAll;
}

export function useTotalHabitList(habitList: Habit[], todayFrequency: HabitFrequency) {
  const {register, watch,} = useForm<FilteredHabitFormData>({
    defaultValues: {
      frequency: todayFrequency
    }
  });

  const currentFrequency = watch('frequency');

  return {
    currentFrequency: watch('frequency'),
    radioPropsList: ALL_HABIT_FREQUENCY_LIST.map(frequency => ({
      ...register('frequency'),
      value: frequency,
    })),
    filteredHabitList: currentFrequency === 'All' ? habitList : habitList.filter(habit => habit.frequency === currentFrequency)
  };
}

export function useDeleteHabit() {
  return useCallback(async (habit: Habit) => {
    if (confirm(`${habit.title.slice(0, 10)}...을 삭제하시겠습니까?`)) {
      try {
        await deleteHabitApi(habit.pk);
        // queryClient.invalidateQueries(HABIT_FULL_RESPONSE_QUERY_KEY);
      } catch (error) {
        alert('삭제 실패!' + JSON.stringify(error));
        console.error(error);
      }
    }
  }, []);
}
