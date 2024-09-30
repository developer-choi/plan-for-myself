import {useCallback, useMemo} from 'react';
import {FieldError, RegisterOptions, SubmitErrorHandler, SubmitHandler, useFieldArray, useForm} from 'react-hook-form';
import {baseHandleErrors} from '@/utils/extend/react-hook-form';
import type {HabitModalProp} from '@/components/modal/habit/HabitModal';
import {HABIT_FREQUENCY_LIST} from '@/utils/service/habit/index';
import {postHabitApi, PostHabitRequest, updateHabitApi, UpdateHabitRequest} from '@/utils/service/api/habit';
import {useMutation} from '@tanstack/react-query';

export function useHabitForm({onClose, data}: HabitModalProp) {
  const {register, handleSubmit, control} = useForm<HabitFormData>({
    mode: 'all',
    defaultValues: !data ? DEFAULT_FORM_DATA : {
      title: data.title,
      memo: data.memo,
      frequency_list: data.frequency_list,
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

  const onError: SubmitErrorHandler<HabitFormData> = useCallback(({title,  children, frequency_list}) => {
    baseHandleErrors([title, children?.root, frequency_list as FieldError | undefined]);
  }, []);

  const onSubmit: SubmitHandler<HabitFormData> = useCallback(async formData => {
    if (!data) {
      const habitParameter: PostHabitRequest = {
        ...formData,
      };

      await postMutation.mutateAsync(habitParameter);
    } else {
      const habitParameter: UpdateHabitRequest = {
        ...formData,
        pk: data.pk,
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
      id: field.id,
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
      checkboxList: HABIT_FREQUENCY_LIST.map(frequency => ({
        ...register('frequency_list', {
          required: '최소 1개 이상의 습관주기는 필수입니다.'
        }),
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
  frequency_list: [],
  children: [
    {title: '', is_important: false}
  ],
};
