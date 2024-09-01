import {SubmitHandler, useForm} from 'react-hook-form';
import {useCallback} from 'react';
import dayjs from 'dayjs';
import {postTodayCheckGoalApi} from '@/utils/service/api/goal';
import {GoalFullResponse} from '@/types/goal';
import {useMutation} from '@tanstack/react-query';

interface CheckGoalListFormData {
  checkedGoalList: string[];
}

export function useCheckGoalListForm({onClose, response}: {
  onClose: () => void,
  response: GoalFullResponse
}) {
  const todayHistory = response?.todayHistory;

  const {register, handleSubmit, watch} = useForm<CheckGoalListFormData>({
    defaultValues: {
      checkedGoalList: !todayHistory ? [] : todayHistory.checked_list.filter(goal => goal.checked).map(goal => goal.pk.toString())
    }
  });

  const {mutateAsync, isPending} = useMutation({
    mutationFn: postTodayCheckGoalApi
  });

  const onSubmit: SubmitHandler<CheckGoalListFormData> = useCallback(async data => {
    if (!response) {
      return;
    }

    if (data.checkedGoalList.length === 0 && !confirm('제출하시겠습니까?')) {
      return;
    }

    await mutateAsync(response.todayGoalList.map(goal => ({
      ...goal,
      checked: data.checkedGoalList.includes(goal.pk.toString())
    })));

    onClose();
    // queryClient.invalidateQueries(GOAL_FULL_RESPONSE_QUERY_KEY);
  }, [mutateAsync, onClose, response]);

  if (!response) {
    return null
  }

  const sourceGoalList = todayHistory?.checked_list.length ? todayHistory.checked_list : response.todayGoalList;

  return {
    form: {
      onSubmit: handleSubmit(onSubmit),
      disabled: !!todayHistory?.has_checked,
      loading: isPending
    },
    radioList: sourceGoalList.map(({pk, title, achieve_price, not_achieve_price, content}) => {
      const checked = watch('checkedGoalList').includes(pk.toString());

      return {
        props: {
          ...register('checkedGoalList'),
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
