import React from 'react';
import {getCalendarNavigation} from '@/utils/extend/date/calendar';
import {DailyStudyTime} from '@/types/studied-time';
import {calculateTotal} from '@/utils/extend/data-type/number';
import {minutesFormat} from '@/utils/service/studied-time';
import styles from './index.module.scss';
import {padToTwoDigits} from '@/utils/extend/data-type/string';

export interface MonthlyStatisticsTableProps {
  year: number;
  month: number;
  data: DailyStudyTime[];
}

export default function MonthlyStatisticsTable({year, month, data}: MonthlyStatisticsTableProps) {
  const {previousCalendar} = getCalendarNavigation(year, month);

  const thisMonth = getMonthlyStatistics(data);

  const previousMonth: MonthlyStatistics = {
    totalStudiedMinutes: 1,
    averageDuringWeekday: 2,
    averageDuringHoliday: 3
  };

  return (
    <table className={styles.table}>
      <thead>
      <tr>
        <td/>
        <th>{previousCalendar.year}-{previousCalendar.month}</th>
        <th>{year}-{month}</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td>총 공부시간</td>
        <td>{padToTwoDigits(minutesFormat(previousMonth.totalStudiedMinutes))}</td>
        <td>{minutesFormat(thisMonth.totalStudiedMinutes)}</td>
      </tr>
      <tr>
        <td>평균 평일 공부시간</td>
        <td>{minutesFormat(previousMonth.averageDuringWeekday)}</td>
        <td>{minutesFormat(thisMonth.averageDuringWeekday)}</td>
      </tr>
      <tr>
        <td>평균 휴일 주말 공부시간</td>
        <td>{minutesFormat(previousMonth.averageDuringHoliday)}</td>
        <td>{minutesFormat(thisMonth.averageDuringHoliday)}</td>
      </tr>
      </tbody>
    </table>
  );
}

interface MonthlyStatistics {
  totalStudiedMinutes: number;
  averageDuringWeekday: number; // 평일 평균 공부시간, 단위 : minutes
  averageDuringHoliday: number; // 주밀&휴일 평균 공부시간, 단위 : minutes
}

function getMonthlyStatistics(data: DailyStudyTime[]): MonthlyStatistics {
  const {total, count} = data.reduce((a, b) => {
    const key = b.date_type === 'quarter' ? 'weekday' : 'holiday';
    a.total[key] += calculateTotal(b.studied_minutes, value => value);
    a.count[key]++;
    return a;
  }, {total: {weekday: 0, holiday: 0}, count: {weekday: 0, holiday: 0}});

  const averageDuringHoliday = Math.floor(total.holiday / count.holiday);
  const averageDuringWeekday = Math.floor(total.weekday / count.weekday);

  return {
    totalStudiedMinutes: total.holiday + total.weekday,
    // 0/0 = NaN
    averageDuringHoliday: Number.isNaN(averageDuringHoliday) ? 0 : averageDuringHoliday,
    averageDuringWeekday: Number.isNaN(averageDuringWeekday) ? 0 : averageDuringWeekday
  };
}
