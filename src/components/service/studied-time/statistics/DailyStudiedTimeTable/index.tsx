'use client';

import React, {ChangeEvent, useCallback, useMemo, useState} from 'react';
import {DailyStudyTime, DailyStudyTimeDateType} from '@/types/studied-time';
import dayjs from 'dayjs';
import {minutesFormat} from '@/utils/service/studied-time';
import {calculateTotal} from '@/utils/extend/data-type/number';
import styles from './index.module.scss';
import Radio, {RadioGroup} from '@/components/form/Radio';

export interface DailyStudiedTimeTableProps {
  year: number;
  month: number;
  data: DailyStudyTime[];
}

export default function DailyStudiedTimeTable({data}: DailyStudiedTimeTableProps) {
  const [filter, setFilter] = useState<DailyStudyTimeDateType>('quarter');

  const onChangeWeekday = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setFilter('quarter');
    }
  }, []);

  const onChangeHoliday = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setFilter('full');
    }
  }, []);

  const filteredList = useMemo(() => {
    return data.filter(({date_type}) => date_type === filter)
  }, [data, filter]);

  return (
    <>
      <RadioGroup>
        <Radio checked={filter === 'quarter'} name="filter" label="평일" onChange={onChangeWeekday}/>
        <Radio checked={filter === 'full'} name="filter" label="주말 및 휴일" onChange={onChangeHoliday}/>
      </RadioGroup>
      <table className={styles.table}>
        <thead>
        <tr>
          <th>날짜</th>
          <th>총 공부시간</th>
          <th>아침</th>
          <th>점심</th>
          <th>저녁</th>
          <th className={styles.fail}>실패 키워드</th>
          <th className={styles.fail}>실패 사유</th>
          <th>기상 시각</th>
          <th>취침 시각</th>
        </tr>
        </thead>
        <tbody>
        {filteredList.map(({pk, bed_time, wake_up_time, fail_keywords, fail_reason, studied_minutes, timestamp}) => (
          <tr key={pk}>
            <td>{dayjs(timestamp).format('YYYY-MM-DD')}</td>
            <td>{totalStudiedTimeFormat(studied_minutes)}</td>
            <td>{studied_minutes[0] === 0 ? '' : minutesFormat(studied_minutes[0])}</td>
            <td>{studied_minutes[1] === 0 ? '' : minutesFormat(studied_minutes[1])}</td>
            <td>{studied_minutes[2] === 0 ? '' : minutesFormat(studied_minutes[2])}</td>
            <td className={styles.fail}>{!fail_keywords.length ? '' : fail_keywords.join(', ')}</td>
            <td className={styles.fail}>{!fail_reason ? '' : fail_reason}</td>
            <td>{!wake_up_time ? '' : wake_up_time}</td>
            <td>{!bed_time ? '' : bed_time}</td>
          </tr>
        ))}
        </tbody>
      </table>
    </>
  );
}

function totalStudiedTimeFormat(value: DailyStudyTime['studied_minutes']) {
  const total = calculateTotal(value, value => value);

  if (total === 0) {
    return '';
  } else {
    return minutesFormat(total);
  }
}