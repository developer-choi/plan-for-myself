import {SubmitHandler, useForm} from 'react-hook-form';
import {useCallback} from 'react';
import dayjs from 'dayjs';
import {postTodayCheckHabitApi} from '@/utils/service/api/habit';
import {Habit, HabitFullResponse} from '@/types/habit';
import {useMutation} from '@tanstack/react-query';
import {RadioProps} from '@/components/form/Radio';

interface CheckHabitListFormData {
  checkedSubHabitList: string[]; // 형식 : habit.pk_children.index
}

export function useCheckHabitListForm({onClose, response}: {
  onClose: () => void,
  response: HabitFullResponse
}) {
  const todayHistory = response.todayHistory;

  const {register, handleSubmit} = useForm<CheckHabitListFormData>({
    defaultValues: {
      checkedSubHabitList: !todayHistory ? [] : todayHistory.checked_list
        .reduce((a, b) => {
          const checkedPKList: string[] = [];

          b.children.forEach(({checked}, index) => {
            if (checked) {
              checkedPKList.push(subHabitToKey(b, index));
            }
          });

          return a.concat(checkedPKList);
        }, [] as string[]),
    }
  });

  const {mutateAsync, isPending} = useMutation({
    mutationFn: postTodayCheckHabitApi
  });

  const onSubmit: SubmitHandler<CheckHabitListFormData> = useCallback(async data => {
    if (!response) {
      return;
    }

    if (data.checkedSubHabitList.length === 0 && !confirm('제출하시겠습니까?')) {
      return;
    }

    await mutateAsync(response.todayHabitList.map(habit => ({
      ...habit,
      children: habit.children.map((sub, index) => ({
        ...sub,
        checked: data.checkedSubHabitList.includes(subHabitToKey(habit, index))
      }))
    })));

    onClose();
    // queryClient.invalidateQueries(HABIT_FULL_RESPONSE_QUERY_KEY);
  }, [mutateAsync, onClose, response]);

  if (!response) {
    return null
  }

  const sourceHabitList = todayHistory.checked_list.length ? todayHistory.checked_list : response.todayHabitList;
  const hasChecked = todayHistory.has_checked;

  console.log('todayHistory', todayHistory);

  const radioList = sourceHabitList.map((habit) => {
    const {pk, children, title, memo} = habit;

    return {
      pk,
      title,
      memo: memo,
      propsList: children.map((subHabit, index) => ({
        ...register('checkedSubHabitList'),
        label: subHabit.title,
        value: subHabitToKey(habit, index),
        disabled: hasChecked
      }) as RadioProps)
    };
  })

  return {
    form: {
      onSubmit: handleSubmit(onSubmit),
      disabled: todayHistory.has_checked,
      loading: isPending
    },
    radioList,
    submittedDate: !todayHistory ? undefined : dayjs(todayHistory.checked_timestamp).format('YYYY-MM-DD HH:mm:ss')
  };
}

function subHabitToKey(parent: Habit, childrenIndex: number) {
  return `${parent.pk}_${childrenIndex}`;
}