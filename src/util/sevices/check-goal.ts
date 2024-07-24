import {SubmitHandler, useForm} from 'react-hook-form';
import {useCallback} from 'react';
import {GOAL_FULL_RESPONSE_QUERY_KEY, useGoalResponse} from '@/util/sevices/goal';
import {useQueryClient} from 'react-query';
import dayjs from 'dayjs';
import {postTodayCheckGoalApi} from '@/util/sevices/api/goal';

interface CheckGoalListFormData {
  checkedGoalList: string[];
}

export function useCheckGoalListForm({closeModal}: {
  closeModal: () => void
}) {
  const {data: response} = useGoalResponse();
  const todayHistory = response?.todayHistory;

  const queryClient = useQueryClient();
  const {register, handleSubmit, watch} = useForm<CheckGoalListFormData>({
    defaultValues: {
      checkedGoalList: !todayHistory ? [] : todayHistory.checked_list.filter(goal => goal.checked).map(goal => goal.pk.toString())
    }
  });

  const onSubmit: SubmitHandler<CheckGoalListFormData> = useCallback(data => {
    if (!response) {
      return;
    }

    if (data.checkedGoalList.length === 0 && !confirm('제출하시겠습니까?')) {
      return;
    }

    postTodayCheckGoalApi(response.todayGoalList.map(goal => ({
      ...goal,
      checked: data.checkedGoalList.includes(goal.pk.toString())
    })));

    closeModal();
    queryClient.invalidateQueries(GOAL_FULL_RESPONSE_QUERY_KEY);
  }, [closeModal, queryClient, response]);

  if (!response) {
    return null
  }

  const sourceGoalList = todayHistory?.checked_list.length ? todayHistory.checked_list : response.todayGoalList;

  return {
    formSubmit: handleSubmit(onSubmit),
    submitDisabled: !!todayHistory?.has_checked,
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
