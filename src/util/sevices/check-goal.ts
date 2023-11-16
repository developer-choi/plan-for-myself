import {SubmitHandler, useForm} from 'react-hook-form';
import {useCallback} from 'react';
import {getTodayGoalFilterFrequency, GOAL_RESPONSE_QUERY_KEY} from '@util/sevices/goal';
import type {GoalResponse} from '@type/goal-server';
import {checkedTodayGoalList} from '@util/server/goal';
import {useQueryClient} from 'react-query';

interface CheckGoalListFormData {
  checkedGoalList: string[];
}

export function useCheckGoalListForm({closeModal, response}: {
  response: GoalResponse | undefined,
  closeModal: () => void
}) {
  const queryClient = useQueryClient();
  const {register, handleSubmit} = useForm<CheckGoalListFormData>({
    defaultValues: {
      checkedGoalList: !response?.hasCheckedToday ? [] : response.checkedGoalHistoryList[0].checkedGoalList.filter(goal => goal.checked).map(goal => goal.pk.toString())
    }
  });

  const onSubmit: SubmitHandler<CheckGoalListFormData> = useCallback(data => {
    if (!response) {
      return;
    }

    if (data.checkedGoalList.length === 0 && !confirm('제출하시겠습니까?')) {
      return;
    }

    checkedTodayGoalList(response.goalList.map(goal => ({
      ...goal,
      checked: data.checkedGoalList.includes(goal.pk.toString())
    })));

    closeModal();
    queryClient.invalidateQueries(GOAL_RESPONSE_QUERY_KEY);
  }, [closeModal, queryClient, response]);

  const filteredGoalList = getTodayGoalFilterFrequency(response?.goalList ?? []);

  return {
    formSubmit: handleSubmit(onSubmit),
    submitDisabled: response?.hasCheckedToday,
    radioList: filteredGoalList.map(({pk, title}) => ({
      props: {
        ...register('checkedGoalList'),
        disabled: response?.hasCheckedToday,
        value: pk
      },
      title
    }))
  };
}
