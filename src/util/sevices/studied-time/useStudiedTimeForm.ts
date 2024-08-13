import {SubmitErrorHandler, SubmitHandler, useForm} from 'react-hook-form';
import {useCallback} from 'react';
import {baseHandleErrors} from '@/util/extend/react-hook-form';
import {DailyStudyTimeDateType} from '@/type/studied-time';
import {InputProps} from '@/component/design-system/form/Input';
import {RadioProps} from '@/component/design-system/form/Radio';
import {useMutation} from 'react-query';
import {
  deleteStudiedTimeApi,
  patchStudiedTimeApi,
  PostDailyStudyTimeParameter,
  postStudiedTimeApi
} from '@/util/sevices/api/studied-time-client';
import {StudiedTimeHistory} from '@/util/sevices/api/studied-time-server';
import {calculateTotal} from '@/util/extend/data-type/number';

export interface StudiedTimeFormData {
  date_type: DailyStudyTimeDateType;
  studied_minutes: {
    part1: string;
    part2: string;
    part3: string;
  };
  fail_keywords: string; // ,로 구분
  fail_reason: string;
}

export default function useStudiedTimeForm(history: StudiedTimeHistory, initialFormData?: StudiedTimeFormData) {
  const {register, handleSubmit, setError, formState: {errors}} = useForm<StudiedTimeFormData>({
    defaultValues: {
      studied_minutes: {
        part1: initializeStudiedMinute(initialFormData?.studied_minutes.part1),
        part2: initializeStudiedMinute(initialFormData?.studied_minutes.part2),
        part3: initializeStudiedMinute(initialFormData?.studied_minutes.part3)
      },
      fail_keywords: initialFormData?.fail_keywords ?? '',
      fail_reason: initialFormData?.fail_reason ?? '',
      date_type: initialFormData?.date_type ?? 'quarter'
    }
  });

  const onError: SubmitErrorHandler<StudiedTimeFormData> = useCallback(({studied_minutes, date_type, fail_keywords, fail_reason}) => {
    baseHandleErrors([
      studied_minutes?.part1,
      studied_minutes?.part2,
      studied_minutes?.part3,
      date_type,
      fail_keywords,
      fail_reason
    ]);
  }, []);

  const postMutation = useMutation(postStudiedTimeApi);
  const updateMutation = useMutation(patchStudiedTimeApi);
  const deleteMutation = useMutation(deleteStudiedTimeApi);
  
  const onSubmit: SubmitHandler<StudiedTimeFormData> = useCallback(async data => {
    // part 1, 2, 3이 빈문자열이어도 Number()에서 0으로 변환됨
    const {part1, part2, part3} = data.studied_minutes;
    const studiedMinutes = [part1, part2, part3].map(value => Number(value)) as [number, number, number];

    const studied = calculateTotal(studiedMinutes, value => value) > 0;
    const failed = !!data.fail_keywords || !!data.fail_reason;

    if (!studied && !failed) {
      setError('fail_reason', {
        type: 'required',
        message: '공부를 하루종일 안했다면, 실패 원인 또는 키워드를 작성해주세요.'
      }, {shouldFocus: true});
      setError('fail_keywords', {
        type: 'required',
        message: '공부를 하루종일 안했다면, 실패 원인 또는 키워드를 작성해주세요.'
      });
      return;
    }

    const {calendarDate: {year, month, date}} = history;

    const postParameter: PostDailyStudyTimeParameter = {
      studied_minutes: studiedMinutes,
      fail_reason: data.fail_reason,
      date_type: data.date_type,
      fail_keywords: data.fail_keywords.split(','),
      timestamp: new Date(`${year}-${month}-${date} 13:00:00`).getTime()
    };

    const pk = history.data?.pk;
    
    try {
      if (pk) {
        await updateMutation.mutateAsync({
          pk,
          ...postParameter
        });
        
      } else {
        await postMutation.mutateAsync(postParameter);
      }
    } catch (error) {
      console.error(error);
    }
  }, [history, postMutation, setError, updateMutation]);

  const dateTypeRadioList: RadioProps[] = [
    {
      label: '평일',
      value: 'quarter',
      ...register('date_type', {
        required: '날짜 종류는 필수입니다.'
      })
    },
    {
      label: '주말, 휴일',
      value: 'full',
      ...register('date_type', {
        required: '날짜 종류는 필수입니다.'
      })
    },
  ];

  // TODO 숫자만 입력가능하게 패턴넣어야함.
  const studiedMinutesInputList: InputProps[] = [
    {
      label: '아침 공부시간 *',
      placeholder: '130 (minutes)',
      ...register('studied_minutes.part1')
    },
    {
      label: '점심 공부시간 *',
      placeholder: '50 (minutes)',
      ...register('studied_minutes.part2')
    },
    {
      label: '저녁 공부시간 *',
      placeholder: '0 (minutes)',
      ...register('studied_minutes.part3')
    },
  ];

  const failKeywordsInputProps: InputProps = {
    label: '(선택) 실패 키워드',
    placeholder: '유튜브,수면 (,로 구분)',
    error: errors.fail_keywords?.message,
    ...register('fail_keywords')
  };

  const failReasonInputProps: InputProps = {
    label: '(선택) 실패 사유',
    placeholder: '하루종일 유튜브 보느라 공부안함',
    error: errors.fail_reason?.message,
    ...register('fail_reason')
  };

  const deleteHistory = useCallback(async () => {
    if(!history.data) {
      return;
    }
    
    try {
      await deleteMutation.mutateAsync(history.data.pk);
    } catch (error) {
      console.error(error);
    }
  }, [deleteMutation, history.data]);

  return {
    form: {
      onSubmit: handleSubmit(onSubmit, onError),
      loading: postMutation.isLoading || updateMutation.isLoading, // TODO 추후 Button loading props에 enableMutating 추가
      deleteHistory
    },
    props: {
      dateType: {
        groupLabel: '날짜 종류',
        list: dateTypeRadioList
      },
      studiedMinutesInputList,
      fail: {
        keywords: failKeywordsInputProps,
        reason: failReasonInputProps
      }
    }
  };
}

// undefined이거나 '0'분이면 빈문자열 반환 (인풋에서 0분이라고 들어있는게 불편해서...)
function initializeStudiedMinute(minute: string | undefined): '' | string {
  return !minute || minute === '0' ? '' : minute;
}
