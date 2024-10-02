import type {Habit, HabitFrequency} from '@/types/habit';
import {useForm} from 'react-hook-form';
import {useCallback} from 'react';
import {deleteHabitApi} from '@/utils/service/api/habit';
import {CheckboxProps} from '@/components/form/Checkbox';

export const HABIT_FREQUENCY_LIST: HabitFrequency[] = ['weekday', 'holiday'];

interface FilteredHabitFormData {
  frequency: HabitFrequency;
  hiddenArchieved: boolean;
}

export function useTotalHabitList(habitList: Habit[], todayFrequency: HabitFrequency) {
  const {register, watch,} = useForm<FilteredHabitFormData>({
    defaultValues: {
      frequency: todayFrequency,
      hiddenArchieved: true
    }
  });

  const hiddenArchievedProps: CheckboxProps = {
    ...register('hiddenArchieved'),
    label: '달성한 습관 숨기기'
  };

  const filteredHabitList = habitList.filter(habit => habit.frequency_list.includes(watch('frequency')) && (watch('hiddenArchieved') ? habit.has_unachieved : true));

  return {
    radioPropsList: HABIT_FREQUENCY_LIST.map(frequency => ({
      ...register('frequency'),
      label: frequency,
      value: frequency,
    })),
    hiddenArchieved: hiddenArchievedProps,
    filteredHabitList
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
