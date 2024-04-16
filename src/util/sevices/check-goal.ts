import {SubmitHandler, useForm} from 'react-hook-form';
import {useCallback} from 'react';
import {GOAL_FULL_RESPONSE_QUERY_KEY, useGoalResponse} from '@util/sevices/goal';
import {checkedTodayGoalList} from '@util/server/goal';
import {useQueryClient} from 'react-query';
import dayjs from 'dayjs';

interface CheckGoalListFormData {
  checkedGoalList: string[];
}

export function useCheckGoalListForm({closeModal}: {
  closeModal: () => void
}) {
  const {data: response} = useGoalResponse();
  const todayHistory = response?.checkedGoalHistoryList[0];

  const queryClient = useQueryClient();
  const {register, handleSubmit} = useForm<CheckGoalListFormData>({
    defaultValues: {
      checkedGoalList: !todayHistory ? [] : todayHistory.checkedGoalList.filter(goal => goal.checked).map(goal => goal.pk.toString())
    }
  });

  const onSubmit: SubmitHandler<CheckGoalListFormData> = useCallback(data => {
    if (!response) {
      return;
    }

    if (data.checkedGoalList.length === 0 && !confirm('제출하시겠습니까?')) {
      return;
    }

    checkedTodayGoalList(response.todayCheckGoalList.map(goal => ({
      ...goal,
      checked: data.checkedGoalList.includes(goal.pk.toString())
    })));

    closeModal();
    queryClient.invalidateQueries(GOAL_FULL_RESPONSE_QUERY_KEY);
  }, [closeModal, queryClient, response]);

  if (!response) {
    return null
  }

  return {
    formSubmit: handleSubmit(onSubmit),
    submitDisabled: response.hasCheckedToday,
    radioList: response.todayCheckGoalList.map(({pk, title}) => ({
      props: {
        ...register('checkedGoalList'),
        disabled: response.hasCheckedToday,
        value: pk
      },
      title
    })),
    submittedDate: !todayHistory ? undefined : dayjs(todayHistory.createdTimestamp).format('YYYY-MM-DD HH:mm:ss')
  };
}
