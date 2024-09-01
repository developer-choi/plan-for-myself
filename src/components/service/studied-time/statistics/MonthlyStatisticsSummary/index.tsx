import React from 'react';
import {getAbsoluteValueWithSign} from '@/utils/extend/data-type/number';
import {minutesFormat} from '@/utils/service/studied-time';
import styles from './index.module.scss';
import {
  analyzeDifferenceMonthlyStatistics,
  DifferenceMonthlyStatisticsParam
} from '@/utils/service/studied-time/statistics';

export default function MonthlyStatisticsSummary(props: DifferenceMonthlyStatisticsParam) {
  const {adjusted, weekday, holiday} = analyzeDifferenceMonthlyStatistics(props);
  const adjustPrefix = adjusted ? '(환산)' : '';

  return (
    <ul>
      <li>
        <span className={styles.name}>{adjustPrefix} 평일 총합 : </span>
        <Value thisMonth={weekday.totalStudied.this} previousMonth={weekday.totalStudied.previous}/>
      </li>
      <li>
        <span className={styles.name}>평일 평균 : </span>
        <Value thisMonth={weekday.averageStudied.this} previousMonth={weekday.averageStudied.previous}/>
      </li>
      <li className={styles.gapTop}>
        <span className={styles.name}>{adjustPrefix} 휴일 총합 : </span>
        <Value thisMonth={holiday.totalStudied.this} previousMonth={holiday.totalStudied.previous}/>
      </li>
      <li>
        <span className={styles.name}>휴일 평균 : </span>
        <Value thisMonth={holiday.averageStudied.this} previousMonth={holiday.averageStudied.previous}/>
      </li>
    </ul>
  );
}

interface ValueProps {
  thisMonth: number;
  previousMonth: number;
}

function Value({thisMonth, previousMonth}: ValueProps) {
  const {signType, sign, absoluteValue} = getAbsoluteValueWithSign(thisMonth - previousMonth);

  return (
    <span className={styles.value}>{minutesFormat(thisMonth)} {previousMonth === 0 ? (
      <span>( - )</span>
    ) : (
      <span className={signType}>({sign}{minutesFormat(absoluteValue)})</span>
    )}</span>
  );
}
