import type {PostGoalRequestParameter} from '@type/goal-server';
import {useCallback} from 'react';
import type {RegisterOptions, SubmitErrorHandler, SubmitHandler} from 'react-hook-form';
import {useForm} from 'react-hook-form';
import {GOAL_FREQUENCY_LIST, GOAL_FULL_RESPONSE_QUERY_KEY} from '@util/sevices/goal';
import {baseHandleErrors} from '@util/extend/react-hook-form';
import type {GoalModalProp} from '@component/modal/GoalModal';
import {createGoal, updateGoal} from '@util/server/goal';
import type {GoalFrequency} from '@type/goal';
import {useQueryClient} from 'react-query';

export function useGoalForm({closeModal, data}: GoalModalProp) {
  const {register, handleSubmit} = useForm<GoalFormData>({
    mode: 'all',
    defaultValues: !data ? DEFAULT_FORM_DATA : {
      title: data.title,
      achievePrice: data.achievePrice.toString(),
      notAchievePrice: data.notAchievePrice.toString(),
      frequency: data.frequency
    },
    shouldFocusError: false
  });

  const onError: SubmitErrorHandler<GoalFormData> = useCallback(({title, achievePrice, notAchievePrice}) => {
    baseHandleErrors([title, achievePrice, notAchievePrice]);
  }, []);

  const queryClient = useQueryClient();

  const onSubmit: SubmitHandler<GoalFormData> = useCallback(formData => {
    const goalParameter: PostGoalRequestParameter = {
      ...formData,
      notAchievePrice: Number(formData.notAchievePrice),
      achievePrice: Number(formData.achievePrice),
      frequency: formData.frequency as GoalFrequency
    };

    if (!data) {
      createGoal(goalParameter);
    } else {
      updateGoal(data, goalParameter);
    }
    queryClient.invalidateQueries(GOAL_FULL_RESPONSE_QUERY_KEY);
    closeModal();
  }, [closeModal, data, queryClient]);

  return {
    formSubmit: handleSubmit(onSubmit, onError),
    inputProps: {
      title: register('title', TITLE_OPTIONS),
      achievePrice: register('achievePrice', ACHIEVE_OPTIONS),
      notAchievePrice: register('notAchievePrice'),
      radioList: GOAL_FREQUENCY_LIST.map(frequency => ({
        ...register('frequency'),
        value: frequency,
      }))
    },
    isEdit: !!data
  };
}

const TITLE_OPTIONS: RegisterOptions = {
  required: '제목은 필수입니다.'
};

const ACHIEVE_OPTIONS: RegisterOptions = {
  required: '달성 시 금액은 필수입니다.'
};

export interface GoalFormData extends Omit<PostGoalRequestParameter, 'notAchievePrice' | 'achievePrice' | 'isImportant'> {
  notAchievePrice: string;
  achievePrice: string;
}

const DEFAULT_FORM_DATA: GoalFormData = {
  title: '',
  notAchievePrice: '',
  frequency: 'Daily',
  achievePrice: '',
};
