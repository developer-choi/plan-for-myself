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
  const todayHistory = response?.todayHistory;

  const queryClient = useQueryClient();
  const {register, handleSubmit, watch} = useForm<CheckGoalListFormData>({
    defaultValues: {
      checkedGoalList: !todayHistory ? [] : todayHistory.checkedList.filter(goal => goal.checked).map(goal => goal.pk.toString())
    }
  });

  const onSubmit: SubmitHandler<CheckGoalListFormData> = useCallback(data => {
    if (!response) {
      return;
    }

    if (data.checkedGoalList.length === 0 && !confirm('제출하시겠습니까?')) {
      return;
    }

    checkedTodayGoalList(response.todayGoalList.map(goal => ({
      ...goal,
      checked: data.checkedGoalList.includes(goal.pk.toString())
    })));

    closeModal();
    queryClient.invalidateQueries(GOAL_FULL_RESPONSE_QUERY_KEY);
  }, [closeModal, queryClient, response]);

  if (!response) {
    return null
  }

  const sourceGoalList = todayHistory?.checkedList.length ? todayHistory.checkedList : response.todayGoalList;

  return {
    formSubmit: handleSubmit(onSubmit),
    submitDisabled: !!todayHistory?.hasChecked,
    radioList: sourceGoalList.map(({pk, title, achievePrice, notAchievePrice, content}) => {
      const checked = watch('checkedGoalList').includes(pk.toString());

      return {
        props: {
          ...register('checkedGoalList'),
          disabled: todayHistory?.hasChecked,
          value: pk
        },
        title,
        content,
        price: checked ? achievePrice : notAchievePrice,
        checked
      };
    }),
    submittedDate: !todayHistory ? undefined : dayjs(todayHistory.checkedTimestamp).format('YYYY-MM-DD HH:mm:ss')
  };
}
