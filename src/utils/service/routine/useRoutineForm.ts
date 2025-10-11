import {PureRoutine, PureRoutineStep, ReadableRoutine} from '@/types/routine';
import {useHandleClientSideError} from '@/utils/service/error/client-side';
import {SubmitErrorHandler, SubmitHandler, useFieldArray, useForm} from 'react-hook-form';
import {useMutation} from '@tanstack/react-query';
import {useCallback, useMemo} from 'react';
import {baseHandleErrors} from '@/utils/extend/react-hook-form';
import {postRoutineApi, updateRoutineApi} from '@/utils/service/api/routine';
import {InputProps} from '@/components/form/Input';
import {itemListToDataOfType} from '@forworkchoe/core/utils';
import {RadioProps} from '@/components/form/Radio';
import {DATE_TYPE_ITEMS, DateType} from '@/utils/service/constant/date-type';
import {getDefaultDateType} from '@/utils/extend/date/holiday';
import {useSortListWithDragAndDrop} from '@/utils/extend/useSortListWithDragAndDrop';
import {useEffectFromTheSecondTime} from '@forworkchoe/core/hooks';
import {useRouter} from 'next/navigation';
import {isLoadingUntilRefresh} from '@/utils/extend/library/react-query';

export interface RoutineFormParameter {
  record: Record<DateType, ReadableRoutine[]>;
  detail?: ReadableRoutine;
}

export default function useRoutineForm({record, detail}: RoutineFormParameter) {
  const {push} = useRouter();
  const handleOnClientError = useHandleClientSideError();
  const {watch, register, handleSubmit, control, setValue} = useForm<CreateRoutineFormData>({
    defaultValues: getDefaultFormData({record, detail})
  });

  const {fields, append, move, remove, } = useFieldArray({
    control,
    name: 'steps',
    // TODO 이거 왜 동작안해?
    rules: {
      minLength: {
        value: 1,
        message: '1개 이상의 step 등록은 필수입니다.',
      }
    }
  });

  const {mutateAsync: postMutateAsync, ...postMutation} = useMutation({
    mutationFn: postRoutineApi
  });
  const {mutateAsync: updateMutateAsync, ...updateMutation} = useMutation({
    mutationFn: updateRoutineApi
  });
  const isLoading = isLoadingUntilRefresh({
    isPending: postMutation.isPending,
    isSuccess: postMutation.isSuccess
  }) || isLoadingUntilRefresh({
    isPending: updateMutation.isPending,
    isSuccess: updateMutation.isSuccess
  });

  const onError: SubmitErrorHandler<CreateRoutineFormData> = useCallback(({title, date_type, steps, routine_type}) => {
    // TODO 타입정의 필요
    //@ts-ignore
    console.log('error', title, date_type, steps?.root, steps?.[0]?.text, steps?.[0]?.keyword, steps?.[0]?.url, routine_type);
    //@ts-ignore
    baseHandleErrors([title, date_type, steps?.root, steps?.[0]?.text, steps?.[0]?.keyword, steps?.[0]?.url, routine_type]);
  }, []);

  const onSubmit: SubmitHandler<CreateRoutineFormData> = useCallback(async (data) => {
    if (isLoading) {
      return;
    }

    try {
      if (detail) {
        await updateMutateAsync({
          ...data,
          id: detail.id
        });
      } else {
        await postMutateAsync(data);
      }

      push(`/routine/list?date_type=${data.date_type}`);
    } catch (error: any) {
      handleOnClientError(error);
    }
  }, [isLoading, detail, push, updateMutateAsync, postMutateAsync, handleOnClientError]);

  const routineType = watch('routine_type');
  const dateType = watch('date_type');

  // date_type, routine_type으로 title 자동완성
  useEffectFromTheSecondTime(useCallback(() => {
    setValue('title', getDefaultTitle(dateType, routineType))
  }, [dateType, routineType, setValue]));

  // date_type이 바뀌면 routine_type 리셋 (아,점,저는 1개씩만 만들어져야해서 다시계산)
  useEffectFromTheSecondTime(useCallback(() => {
    setValue('routine_type', getDefaultRoutineType(dateType, record));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateType]));

  const titleInputProps: InputProps = {
    ...register('title', {
      required: '루틴 이름은 필수입니다.'
    }),
    label: '루틴 이름',
    disabled: routineType !== 'custom'
  };

  const routineTypeRadioPropsList: RadioProps[] = ROUTINE_TYPE_ITEMS.itemList.map(({name, value}) => ({
    ...register('routine_type', {
      required: '루틴 종류는 필수입니다.'
    }),
    label: name,
    value,
    disabled: isDisabledRoutineType(value, record[dateType], detail)
  }));

  const dateTypeRadioPropsList: RadioProps[] = DATE_TYPE_ITEMS.itemList.map(({name, value}) => ({
    ...register('date_type', {
      required: '날짜 타입은 필수입니다.'
    }),
    label: name,
    value,
  }));

  const stepList = useMemo(() => {
    return fields.map((field, index) => {
      switch (field.type) {
        case 'habit':
          return {
            id: field.id,
            type: field.type,
            text: {
              ...register(`steps.${index}.text`, {
                required: '텍스트는 필수입니다.'
              }),
              placeholder: '습관 내용'
            },
            keyword: {
              ...register(`steps.${index}.keyword`, {
                required: '키워드는 필수입니다.'
              }),
              placeholder: 'ex) Spare_Time 실패했을 때 카운트 될 keyword'
            },
          };

        case 'link':
          return {
            id: field.id,
            type: field.type,
            text: {
              ...register(`steps.${index}.text`, {
                required: '텍스트는 필수입니다.'
              }),
              placeholder: 'text'
            },
            url: {
              ...register(`steps.${index}.url`, {
                required: 'URL은 필수입니다.'
              }),
              placeholder: 'ex) https://... 문서 URL'
            },
          };
          
        case 'studied_minutes': {
          const inputProps: InputProps = {
            disabled: true,
            label: '공부 한 시간',
            placeholder: 'ex) 130분'
          };
          
          return {
            id: field.id,
            type: field.type,
            input: inputProps
          };
        }

        case 'sleep_time':
          const inputProps: InputProps = {
            disabled: true,
            label: routineType === 'morning' ? '기상 시각' : routineType === 'night' ? '취침 시각' : '',
            placeholder: 'ex) 130분'
          };

          return {
            id: field.id,
            type: field.type,
            input: inputProps
          };
      }
    });
  }, [fields, register, routineType]);

  const appendLinkStep = useCallback(() => {
    append({
      type: 'link',
      text: '',
      url: '',
    });
  }, [append]);

  const appendHabitStep = useCallback(() => {
    append({
      type: 'habit',
      keyword: '',
      text: ''
    });
  }, [append]);

  // TODO routine_type이 바뀔 때, 아점저면 끝에 추가하고, 아니면 삭제해야함.
  const appendStudiedMinutesStep = useCallback(() => {
    append({
      type: 'studied_minutes',
    });
  }, [append]);

  // TODO routine_type이 바뀔 때, 아침이면 처음에 추가하고, 저녁이면 끝에 추가해야함.
  const appendSleepTimeStep = useCallback(() => {
    append({
      type: 'sleep_time',
    });
  }, [append]);

  const dragAndDropProps = useSortListWithDragAndDrop({
    list: stepList,
    onChange: {
      moveIndex: move
    }
  });

  return {
    form: {
      onSubmit: handleSubmit(onSubmit, onError),
      isLoading: isLoading,
      append: {
        link: appendLinkStep,
        habit: appendHabitStep,
        studiedMinutes: appendStudiedMinutesStep,
        sleepTime: appendSleepTimeStep
      },
    },
    inputProps: {
      routineType: routineTypeRadioPropsList,
      title: titleInputProps,
      dateType: dateTypeRadioPropsList,
    },
    step: {
      list: stepList,
      dragAndDrop: dragAndDropProps,
      remove // TODO 삭제 기능을 넣되, 주의사항으로 이 스탭을 진행한 기록이 모두 삭제된다고 묻기
    }
  };
}

/*************************************************************************************************************
 * Non Export
 *************************************************************************************************************/
const ROUTINE_TYPE_ITEMS = itemListToDataOfType<PureRoutine['routine_type']>([
  {
    name: '아침 루틴',
    value: 'morning'
  },
  {
    name: '점심 루틴',
    value: 'lunch'
  },
  {
    name: '저녁 루틴',
    value: 'night'
  },
  {
    name: '사용자 정의 루틴',
    value: 'custom'
  },
]);

function getDefaultFormData({record, detail}: RoutineFormParameter): CreateRoutineFormData {
  if (detail) {
    return {
      routine_type: detail.routine_type,
      date_type: detail.date_type,
      title: detail.title,
      steps: detail.steps
    };
  }

  const dateType = getDefaultDateType();
  const routineType = getDefaultRoutineType(dateType, record);

  return {
    date_type: dateType,
    routine_type: getDefaultRoutineType(dateType, record),
    title: getDefaultTitle(dateType, routineType),
    steps: [] 
  };
}

function getDefaultRoutineType(dateType: DateType, record: Record<DateType, ReadableRoutine[]>): PureRoutine['routine_type'] {
  const list = record[dateType];
  const result = ROUTINE_TYPE_ITEMS.typeList.filter(routineType => !list.find(routine => routine.routine_type === routineType));

  if (result.length) {
    return result[0];
  } else {
    return 'custom';
  }
}

function getDefaultTitle(dateType: DateType, routineType: PureRoutine['routine_type']) {
  if (routineType === 'custom') {
    return '';
  }

  return `${DATE_TYPE_ITEMS.record[dateType]} ${ROUTINE_TYPE_ITEMS.record[routineType]}`;
}

interface CreateRoutineFormData extends Pick<PureRoutine, 'title' | 'routine_type' | 'date_type'> {
  steps: (PureRoutineStep & {
    id?: number; // 수정폼이면 있을 수도 있음.
  })[];
}

function isDisabledRoutineType(value: PureRoutine['routine_type'], list: ReadableRoutine[], detail?: ReadableRoutine) {
  if (value === 'custom' || value === detail?.routine_type) {
    return false;
  }

  /**
   * 수정, 생성 페이지와 관계없이,
   * 기존에 만들어둔 아점저가 있다면 추가 생성 및 수정이 불가능함.
   *
   * 점,저가 있다면 아침 루틴을 점,저로 수정할 수 없음. (점,저를 지우지않는이상)
   */
  return list.map(routine => routine.routine_type).includes(value);
}
