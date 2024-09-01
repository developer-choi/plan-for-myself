import {SubmitHandler, useForm} from 'react-hook-form';
import {useCallback} from 'react';
import dayjs from 'dayjs';
import {postTodayCheckHabitApi} from '@/utils/service/api/habit';
import {HabitFullResponse} from '@/types/habit';
import {useMutation} from '@tanstack/react-query';

interface CheckHabitListFormData {
  checkedHabitList: string[];
}

export function useCheckHabitListForm({onClose, response}: {
  onClose: () => void,
  response: HabitFullResponse
}) {
  const todayHistory = response?.todayHistory;

  const {register, handleSubmit, watch} = useForm<CheckHabitListFormData>({
    defaultValues: {
      checkedHabitList: !todayHistory ? [] : todayHistory.checked_list.filter(habit => habit.checked).map(habit => habit.pk.toString())
    }
  });

  const {mutateAsync, isPending} = useMutation({
    mutationFn: postTodayCheckHabitApi
  });

  const onSubmit: SubmitHandler<CheckHabitListFormData> = useCallback(async data => {
    if (!response) {
      return;
    }

    if (data.checkedHabitList.length === 0 && !confirm('제출하시겠습니까?')) {
      return;
    }

    await mutateAsync(response.todayHabitList.map(habit => ({
      ...habit,
      checked: data.checkedHabitList.includes(habit.pk.toString())
    })));

    onClose();
    // queryClient.invalidateQueries(HABIT_FULL_RESPONSE_QUERY_KEY);
  }, [mutateAsync, onClose, response]);

  if (!response) {
    return null
  }

  const sourceHabitList = todayHistory?.checked_list.length ? todayHistory.checked_list : response.todayHabitList;

  return {
    form: {
      onSubmit: handleSubmit(onSubmit),
      disabled: !!todayHistory?.has_checked,
      loading: isPending
    },
    radioList: sourceHabitList.map(({pk, title, achieve_price, not_achieve_price, content}) => {
      const checked = watch('checkedHabitList').includes(pk.toString());

      return {
        props: {
          ...register('checkedHabitList'),
          disabled: todayHistory?.has_checked,
          value: pk
        },
        title,
        content,
        price: checked ? achieve_price : not_achieve_price,
        checked
      };
    }),
    submittedDate: !todayHistory ? undefined : dayjs(todayHistory.checked_timestamp).format('YYYY-MM-DD HH:mm:ss')
  };
}
