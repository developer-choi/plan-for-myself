'use client';

import React from 'react';
import {DailyStudyTime} from '@/types/studied-time';
import dayjs from 'dayjs';
import {minutesFormat} from '@/utils/service/studied-time';
import {calculateTotal} from '@/utils/extend/data-type/number';
import styles from './index.module.scss';
import Radio, {RadioGroup} from '@/components/form/Radio';
import useFilterDailyStudiedHistory from '@/utils/service/studied-time/useFilterDailyStudiedHistory';
import Checkbox from '@/components/form/Checkbox';
import classNames from 'classnames';
import {DateType} from '@/utils/service/constant/date-type';

export interface DailyStudiedTimeTableProps {
  year: number;
  month: number;
  data: DailyStudyTime[];
}

export default function DailyStudiedTimeTable({data}: DailyStudiedTimeTableProps) {
  const {list, inputProps} = useFilterDailyStudiedHistory(data);

  return (
    <>
      <RadioGroup>
        {inputProps.dateType.map(props => (
          <Radio key={props.value as DateType} {...props}/>
        ))}
      </RadioGroup>
      <RadioGroup>
        {inputProps.day.map(props => (
          <Checkbox key={props.value as number} {...props}/>
        ))}
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
        {list.map(({pk, bed_time, wake_up_time, fail_keywords, fail_reason, studied_minutes, timestamp}) => {
          const dateText = dayjs(timestamp).format('YYYY-MM-DD ddd');
          const totalStudiedTime = totalStudiedTimeFormat(studied_minutes);
          const studiedTime = {
            morning: studied_minutes[0] === 0 ? '' : minutesFormat(studied_minutes[0]),
            lunch: studied_minutes[1] === 0 ? '' : minutesFormat(studied_minutes[1]),
            dinner: studied_minutes[2] === 0 ? '' : minutesFormat(studied_minutes[2])
          };
          const failKeywords = !fail_keywords.length ? '' : fail_keywords.join(', ');

          return (
            <tr key={pk}>
              <td>{dateText}</td>
              <td className={classNames({[styles.empty]: !totalStudiedTime})}>{totalStudiedTime}</td>
              <td className={classNames({[styles.empty]: !studiedTime.morning})}>{studiedTime.morning}</td>
              <td className={classNames({[styles.empty]: !studiedTime.lunch})}>{studiedTime.lunch}</td>
              <td className={classNames({[styles.empty]: !studiedTime.dinner})}>{studiedTime.dinner}</td>
              <td className={classNames(styles.fail, {[styles.empty]: !failKeywords})}>{failKeywords}</td>
              <td className={classNames(styles.fail, {[styles.empty]: !fail_reason})}>{fail_reason}</td>
              <td className={classNames({[styles.empty]: !wake_up_time})}>{wake_up_time}</td>
              <td className={classNames({[styles.empty]: !bed_time})}>{bed_time}</td>
            </tr>
          );
        })}
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