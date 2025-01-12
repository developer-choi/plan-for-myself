import {RegisterOptions, SubmitErrorHandler, SubmitHandler, useForm} from 'react-hook-form';
import {useCallback} from 'react';
import {baseHandleErrors} from '@/utils/extend/react-hook-form';
import {DailyStudyTime} from '@/types/studied-time';
import {InputProps} from '@/components/form/Input';
import {RadioProps} from '@/components/form/Radio';
import {
  deleteStudiedTimeApi,
  patchStudiedTimeApi,
  PostDailyStudyTimeParameter,
  postStudiedTimeApi,
  StudiedTimeCalendarWeek
} from '@/utils/service/api/studied-time';
import {useMutation} from '@tanstack/react-query';
import {isHolidayDate} from '@/utils/extend/date/holiday';
import {DATE_TYPE_ITEMS} from '@/utils/service/constant/date-type';
import {revalidateTagOnServerAction} from '@/utils/extend/library/revalidate-tag';

export interface StudiedTimeFormData extends Pick<DailyStudyTime, 'date_type' | 'wake_up_time' | 'bed_time'> {
  studied_minutes: {
    part1: string;
    part2: string;
    part3: string;
  };
  fail_keywords: string; // ,로 구분
}

export default function useStudiedTimeForm(history: StudiedTimeCalendarWeek, onClose: () => void, initialFormData?: StudiedTimeFormData) {
  const {register, handleSubmit, formState: {errors}} = useForm<StudiedTimeFormData>({
    defaultValues: {
      studied_minutes: {
        part1: initializeStudiedMinute(initialFormData?.studied_minutes.part1),
        part2: initializeStudiedMinute(initialFormData?.studied_minutes.part2),
        part3: initializeStudiedMinute(initialFormData?.studied_minutes.part3)
      },
      fail_keywords: initialFormData?.fail_keywords ?? '',
      date_type: initialFormData?.date_type ?? (isHolidayDate(history.calendarDate) ? 'holiday' : 'weekday'),
      wake_up_time: initialFormData?.wake_up_time,
      bed_time: initialFormData?.bed_time
    }
  });

  const onError: SubmitErrorHandler<StudiedTimeFormData> = useCallback(({studied_minutes, date_type, fail_keywords}) => {
    baseHandleErrors([
      studied_minutes?.part1,
      studied_minutes?.part2,
      studied_minutes?.part3,
      date_type,
      fail_keywords,
    ]);
  }, []);

  const postMutation = useMutation({
    mutationFn: postStudiedTimeApi
  });
  const updateMutation = useMutation({
    mutationFn: patchStudiedTimeApi
  });
  const deleteMutation = useMutation({
    mutationFn: deleteStudiedTimeApi
  });

  const onSubmit: SubmitHandler<StudiedTimeFormData> = useCallback(async data => {
    // part 1, 2, 3이 빈문자열이어도 Number()에서 0으로 변환됨
    const {part1, part2, part3} = data.studied_minutes;
    const studiedMinutes = [part1, part2, part3].map(value => Number(value)) as [number, number, number];
    const {calendarDate: {year, month, date}} = history;

    const postParameter: PostDailyStudyTimeParameter = {
      ...data,
      studied_minutes: studiedMinutes,
      fail_keywords: data.fail_keywords.split(',').map(keyword => keyword.trim()),
      year,
      month,
      date
    };

    const historyData = history.data;

    try {
      if (historyData) {
        await updateMutation.mutateAsync({
          pk: historyData.pk,
          timestamp: historyData.timestamp,
          ...postParameter
        });

      } else {
        await postMutation.mutateAsync(postParameter);
      }

      await revalidateTagOnServerAction('STUDIED_TIME_CALENDAR');
      onClose();
    } catch (error: any) {
      console.error(error);

      if (error.text) {
        return alert(error.text);
      }
    }
  }, [history, onClose, postMutation, updateMutation]);

  const dateTypeRadioList: RadioProps[] = DATE_TYPE_ITEMS.itemList.map(({name, value}) => ({
    label: name,
    value,
    ...register('date_type', {
      required: '날짜 종류는 필수입니다.'
    })
  }));

  // TODO 숫자만 입력가능하게 패턴넣어야함.
  const studiedMinutesInputList: InputProps[] = [
    {
      ...register('studied_minutes.part1'),
      label: '아침 공부시간',
      placeholder: '130 (minutes)',
      autoComplete: 'off',
    },
    {
      ...register('studied_minutes.part2'),
      label: '점심 공부시간',
      placeholder: '50 (minutes)',
      autoComplete: 'off',
    },
    {
      ...register('studied_minutes.part3'),
      label: '저녁 공부시간',
      placeholder: '0 (minutes)',
      autoComplete: 'off',
    },
  ];

  const failKeywordsInputProps: InputProps = {
    ...register('fail_keywords'),
    label: '실패 키워드',
    placeholder: '유튜브,수면 (,로 구분)',
    error: errors.fail_keywords?.message,
  };

  const wakeupTimeInputProps: InputProps = {
    ...register('wake_up_time', HOUR_MINUTE_OPTIONS),
    label: '기상 시각',
    placeholder: 'HH:mm',
    error: errors.wake_up_time?.message,
  };

  const bedTimeInputProps: InputProps = {
    ...register('bed_time', HOUR_MINUTE_OPTIONS),
    label: '취침 시각',
    placeholder: 'HH:mm',
    error: errors.bed_time?.message,
  };

  const deleteHistory = useCallback(async () => {
    if(!history.data) {
      return;
    }
    
    const {calendarDate: {month, date}} = history;
    
    if(!confirm(`${month}월 ${date}일 기록을 삭제하시겠습니까?`)) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(history.data.pk);
      await revalidateTagOnServerAction('STUDIED_TIME_CALENDAR');
      onClose();
    } catch (error) {
      console.error(error);
    }
  }, [deleteMutation, history, onClose]);

  return {
    form: {
      onSubmit: handleSubmit(onSubmit, onError),
      loading: postMutation.isPending || updateMutation.isPending,
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
      },
      wakeupTimeInputProps,
      bedTimeInputProps
    }
  };
}

/*************************************************************************************************************
 * Non Export
 *************************************************************************************************************/
const HOUR_MINUTE_OPTIONS: RegisterOptions = {
  validate: {
    pattern: value => {
      if (!value) {
        return true;
      }

      if (/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) {
        return true;
      }

      return 'HH:mm 형식으로 입력해주세요.';
    }
  }
};

// undefined이거나 '0'분이면 빈문자열 반환 (인풋에서 0분이라고 들어있는게 불편해서...)
function initializeStudiedMinute(minute: string | undefined): '' | string {
  return !minute || minute === '0' ? '' : minute;
}
