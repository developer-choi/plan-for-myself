import {useCallback, useMemo} from 'react';
import {RegisterOptions, SubmitErrorHandler, SubmitHandler, useFieldArray, useForm} from 'react-hook-form';
import {baseHandleErrors} from '@/utils/extend/react-hook-form';
import type {HabitModalProp} from '@/components/modal/habit/HabitModal';
import type {HabitFrequency} from '@/types/habit';
import {HABIT_FREQUENCY_LIST} from '@/utils/service/habit/index';
import {postHabitApi, PostHabitRequest, updateHabitApi, UpdateHabitRequest} from '@/utils/service/api/habit';
import {useMutation} from '@tanstack/react-query';

export function useHabitForm({onClose, data}: HabitModalProp) {
  const {register, handleSubmit, control} = useForm<HabitFormData>({
    mode: 'all',
    defaultValues: !data ? DEFAULT_FORM_DATA : {
      title: data.title,
      memo: data.memo,
      frequency: data.frequency,
      children: data.children
    },
    shouldFocusError: false
  });
  const {fields, append, remove} = useFieldArray({
    control,
    name: 'children',
    rules: {
      required: '최소 1개 이상의 하위습관을 등록해야합니다.',
      minLength: {
        value: 1,
        message: '최소 1개 이상의 하위습관을 등록해야합니다.'
      }
    }
  });

  const postMutation = useMutation({
    mutationFn: postHabitApi
  });
  const updateMutation = useMutation({
    mutationFn: updateHabitApi
  });

  const onError: SubmitErrorHandler<HabitFormData> = useCallback(({title,  children}) => {
    baseHandleErrors([title, children?.root]);
  }, []);

  const onSubmit: SubmitHandler<HabitFormData> = useCallback(async formData => {
    if (!data) {
      const habitParameter: PostHabitRequest = {
        ...formData,
        frequency: formData.frequency as HabitFrequency
      };

      await postMutation.mutateAsync(habitParameter);
    } else {
      const habitParameter: UpdateHabitRequest = {
        ...formData,
        pk: data.pk,
        frequency: formData.frequency as HabitFrequency,
        children: formData.children
      };

      await updateMutation.mutateAsync({
        ...habitParameter
      });
    }
    // queryClient.invalidateQueries(HABIT_FULL_RESPONSE_QUERY_KEY);
    onClose();
  }, [data, onClose, postMutation, updateMutation]);

  const childrenList = useMemo(() => {
    return fields.map((field, index) => ({
      props: register(`children.${index}.title`),
      is_important: field.is_important
    }));
  }, [fields, register]);

  const appendChildren = useCallback(() => {
    append({
      title: '',
      is_important: false
    });
  }, [append]);

  const removeChildren = useCallback((index: number) => {
    remove(index);
  }, [remove]);

  return {
    form: {
      onSubmit: handleSubmit(onSubmit, onError),
      loading: postMutation.isPending || updateMutation.isPending,
      appendChildren,
      removeChildren
    },
    inputProps: {
      title: register('title', TITLE_OPTIONS),
      memo: register('memo'),
      radioList: HABIT_FREQUENCY_LIST.map(frequency => ({
        ...register('frequency'),
        value: frequency,
        label: frequency
      })),
      childrenList
    },
    isEdit: !!data
  };
}

const TITLE_OPTIONS: RegisterOptions = {
  required: '제목은 필수입니다.'
};

export type HabitFormData = Omit<UpdateHabitRequest, 'isImportant'>;

const DEFAULT_FORM_DATA: HabitFormData = {
  pk: 0,
  title: '',
  memo: '',
  frequency: 'Daily',
  children: []
};
