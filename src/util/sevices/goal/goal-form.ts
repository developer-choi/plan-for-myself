import {useCallback} from 'react';
import type {RegisterOptions, SubmitErrorHandler, SubmitHandler} from 'react-hook-form';
import {useForm} from 'react-hook-form';
import {GOAL_FREQUENCY_LIST} from '@/util/sevices/goal/index';
import {baseHandleErrors} from '@/util/extend/react-hook-form';
import type {GoalModalProp} from '@/component/modal/goal/GoalModal';
import type {GoalFrequency} from '@/type/goal';
import {postGoalApi, PostGoalRequestParameter, updateGoalApi} from '@/util/sevices/api/goal-client';

export function useGoalForm({closeModal, data}: GoalModalProp) {
  const {register, handleSubmit} = useForm<GoalFormData>({
    mode: 'all',
    defaultValues: !data ? DEFAULT_FORM_DATA : {
      title: data.title,
      content: data.content,
      achievePrice: data.achieve_price.toString(),
      notAchievePrice: data.not_achieve_price.toString(),
      frequency: data.frequency
    },
    shouldFocusError: false
  });

  const onError: SubmitErrorHandler<GoalFormData> = useCallback(({title, achievePrice, notAchievePrice}) => {
    baseHandleErrors([title, achievePrice, notAchievePrice]);
  }, []);

  const onSubmit: SubmitHandler<GoalFormData> = useCallback(formData => {
    const goalParameter: PostGoalRequestParameter = {
      ...formData,
      not_achieve_price: Number(formData.notAchievePrice),
      achieve_price: Number(formData.achievePrice),
      frequency: formData.frequency as GoalFrequency
    };

    if (!data) {
      postGoalApi(goalParameter);
    } else {
      updateGoalApi(data.pk, goalParameter);
    }
    // queryClient.invalidateQueries(GOAL_FULL_RESPONSE_QUERY_KEY);
    closeModal();
  }, [closeModal, data]);

  return {
    formSubmit: handleSubmit(onSubmit, onError),
    inputProps: {
      title: register('title', TITLE_OPTIONS),
      content: register('content'),
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

export interface GoalFormData extends Omit<PostGoalRequestParameter, 'not_achieve_price' | 'achieve_price' | 'isImportant'> {
  notAchievePrice: string;
  achievePrice: string;
}

const DEFAULT_FORM_DATA: GoalFormData = {
  title: '',
  content: '',
  notAchievePrice: '',
  frequency: 'Daily',
  achievePrice: '',
};
