import {useCallback} from 'react';
import type {RegisterOptions, SubmitErrorHandler, SubmitHandler} from 'react-hook-form';
import {useForm} from 'react-hook-form';
import {baseHandleErrors} from '@/utils/extend/react-hook-form';
import type {HabitModalProp} from '@/components/modal/habit/HabitModal';
import type {HabitFrequency} from '@/types/habit';
import {HABIT_FREQUENCY_LIST} from '@/utils/service/habit/index';
import {postHabitApi, PostHabitRequestParameter, updateHabitApi} from '@/utils/service/api/habit';
import {useMutation} from '@tanstack/react-query';

export function useHabitForm({onClose, data}: HabitModalProp) {
  const {register, handleSubmit} = useForm<HabitFormData>({
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

  const onError: SubmitErrorHandler<HabitFormData> = useCallback(({title, achievePrice, notAchievePrice}) => {
    baseHandleErrors([title, achievePrice, notAchievePrice]);
  }, []);

  const postMutation = useMutation({
    mutationFn: postHabitApi
  });
  const updateMutation = useMutation({
    mutationFn: updateHabitApi
  });

  const onSubmit: SubmitHandler<HabitFormData> = useCallback(async formData => {
    const habitParameter: PostHabitRequestParameter = {
      ...formData,
      not_achieve_price: Number(formData.notAchievePrice),
      achieve_price: Number(formData.achievePrice),
      frequency: formData.frequency as HabitFrequency
    };

    if (!data) {
      await postMutation.mutateAsync(habitParameter);
    } else {
      await updateMutation.mutateAsync({
        pk: data.pk,
        ...habitParameter
      });
    }
    // queryClient.invalidateQueries(HABIT_FULL_RESPONSE_QUERY_KEY);
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
      radioList: HABIT_FREQUENCY_LIST.map(frequency => ({
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

export interface HabitFormData extends Omit<PostHabitRequestParameter, 'not_achieve_price' | 'achieve_price' | 'isImportant'> {
  notAchievePrice: string;
  achievePrice: string;
}

const DEFAULT_FORM_DATA: HabitFormData = {
  title: '',
  content: '',
  notAchievePrice: '',
  frequency: 'Daily',
  achievePrice: '',
};
