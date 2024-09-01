import React from 'react';
import {DailyStudyTime} from '@/types/studied-time';
import {calculateTotal, getAbsoluteValueWithSign} from '@/utils/extend/data-type/number';
import {minutesFormat} from '@/utils/service/studied-time';
import styles from './index.module.scss';

export interface MonthlyStatisticsSummaryProps {
  monthData: {
    this: DailyStudyTime[];
    previous: DailyStudyTime[];
  };
}

export default function MonthlyStatisticsSummary({monthData}: MonthlyStatisticsSummaryProps) {
  const thisMonthSummary = getMonthlyStatisticsSummary(monthData.this);
  const previousMonthSummary = getMonthlyStatisticsSummary(monthData.previous);

  return (
    <ul>
      <li>
        <span className={styles.name}>평일 총합 : </span>
        <Value thisMonth={thisMonthSummary.totalWeekdayStudied} previousMonth={previousMonthSummary.totalWeekdayStudied}/>
      </li>
      <li>
        <span className={styles.name}>평일 평균 : </span>
        <Value thisMonth={thisMonthSummary.averageDuringWeekday} previousMonth={previousMonthSummary.averageDuringWeekday}/>
      </li>
      <li className={styles.gapTop}>
        <span className={styles.name}>휴일 총합 : </span>
        <Value thisMonth={thisMonthSummary.totalHolidayStudied} previousMonth={previousMonthSummary.totalHolidayStudied}/>
      </li>
      <li>
        <span className={styles.name}>휴일 평균 : </span>
        <Value thisMonth={thisMonthSummary.averageDuringHoliday} previousMonth={previousMonthSummary.averageDuringHoliday}/>
      </li>
    </ul>
  );
}

interface MonthlyStatistics {
  totalWeekdayStudied: number;
  averageDuringWeekday: number; // 평일 평균 공부시간, 단위 : minutes
  totalHolidayStudied: number;
  averageDuringHoliday: number; // 주밀&휴일 평균 공부시간, 단위 : minutes
}

function getMonthlyStatisticsSummary(data: DailyStudyTime[]): MonthlyStatistics {
  const {total, count} = data.reduce((a, b) => {
    const key = b.date_type === 'weekday' ? 'weekday' : 'holiday';
    a.total[key] += calculateTotal(b.studied_minutes, value => value);
    a.count[key]++;
    return a;
  }, {total: {weekday: 0, holiday: 0}, count: {weekday: 0, holiday: 0}});

  const averageDuringHoliday = Math.floor(total.holiday / count.holiday);
  const averageDuringWeekday = Math.floor(total.weekday / count.weekday);

  return {
    totalHolidayStudied: total.holiday,
    totalWeekdayStudied: total.weekday,
    // 0/0 = NaN
    averageDuringHoliday: Number.isNaN(averageDuringHoliday) ? 0 : averageDuringHoliday,
    averageDuringWeekday: Number.isNaN(averageDuringWeekday) ? 0 : averageDuringWeekday
  };
}

interface ValueProps {
  thisMonth: number;
  previousMonth: number;
}

function Value({thisMonth, previousMonth}: ValueProps) {
  const {signType, sign, absoluteValue} = getAbsoluteValueWithSign(thisMonth - previousMonth);

  return (
    <span className={styles.value}>{minutesFormat(thisMonth)} <span className={signType}>({sign}{minutesFormat(absoluteValue)})</span></span>
  );
}
