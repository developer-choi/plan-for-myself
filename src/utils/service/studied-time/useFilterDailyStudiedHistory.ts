'use client';

import {useMemo} from 'react';
import {DailyStudyTime, DailyStudyTimeDateType} from '@/types/studied-time';
import {useForm} from 'react-hook-form';
import {RadioProps} from '@/components/form/Radio';
import {CheckboxProps} from '@/components/form/Checkbox';

export default function useFilterDailyStudiedHistory(data: DailyStudyTime[]) {
  const {register, watch} = useForm<FilterFormData>({
    defaultValues: {
      date_type: 'quarter',
      day: ['1', '2', '3', '4', '5', '6', '0']
    }
  });

  const dateTypeRadioList: RadioProps[] = DATE_TYPE_LIST.map(({name, value}) => ({
    ...register('date_type'),
    label: name,
    value,
  }));

  const dayCheckboxList: CheckboxProps[] = DAY_TYPE_LIST.map(({name, value}) => ({
    ...register('day'),
    label: name,
    value
  }));

  const dateType = watch('date_type');
  const day = watch('day');

  const filteredList = useMemo(() => {
    return data.filter(({date_type, timestamp}) => date_type === dateType && day.includes(new Date(timestamp).getDay().toString()));
  }, [data, dateType, day]);

  return {
    list: filteredList,
    inputProps: {
      dateType: dateTypeRadioList,
      day: dayCheckboxList
    }
  };
}

interface FilterFormData {
  date_type: DailyStudyTimeDateType;
  day: string[];
}

const DATE_TYPE_LIST = [
  {
    name: '평일',
    value: 'quarter'
  },
  {
    name: '주말, 휴일',
    value: 'full'
  },
];

const DAY_TYPE_LIST = [
  {
    name: 'Mon',
    value: 1
  },
  {
    name: 'Tue',
    value: 2
  },
  {
    name: 'Wed',
    value: 3
  },
  {
    name: 'Thu',
    value: 4
  },
  {
    name: 'Fri',
    value: 5
  },
  {
    name: 'Sat',
    value: 6
  },
  {
    name: 'Sun',
    value: 0
  },
];
