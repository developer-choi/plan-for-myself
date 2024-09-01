import {useCallback} from 'react';
import type {RegisterOptions, SubmitErrorHandler, SubmitHandler} from 'react-hook-form';
import {useForm} from 'react-hook-form';
import {baseHandleErrors} from '@/utils/extend/react-hook-form';
import type {GoalModalProp} from '@/components/modal/goal/GoalModal';
import type {GoalFrequency} from '@/types/goal';
import {GOAL_FREQUENCY_LIST} from '@/utils/service/goal/index';
import {postGoalApi, PostGoalRequestParameter, updateGoalApi} from '@/utils/service/api/goal';
import {useMutation} from '@tanstack/react-query';

export function useGoalForm({onClose, data}: GoalModalProp) {
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

  const postMutation = useMutation({
    mutationFn: postGoalApi
  });
  const updateMutation = useMutation({
    mutationFn: updateGoalApi
  });

  const onSubmit: SubmitHandler<GoalFormData> = useCallback(async formData => {
    const goalParameter: PostGoalRequestParameter = {
      ...formData,
      not_achieve_price: Number(formData.notAchievePrice),
      achieve_price: Number(formData.achievePrice),
      frequency: formData.frequency as GoalFrequency
    };

    if (!data) {
      await postMutation.mutateAsync(goalParameter);
    } else {
      await updateMutation.mutateAsync({
        pk: data.pk,
        ...goalParameter
      });
    }
    // queryClient.invalidateQueries(GOAL_FULL_RESPONSE_QUERY_KEY);
    onClose();
  }, [data, onClose, postMutation, updateMutation]);

  return {
    form: {
      onSubmit: handleSubmit(onSubmit, onError),
      loading: postMutation.isPending || updateMutation.isPending,
    },
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
