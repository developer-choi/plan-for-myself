import styles from './page.module.scss';
import {Metadata, ServerComponentProps} from 'next';
import StudiedCalendarCell from '@/components/service/studied-time/StudiedCalendarCell';
import {getStudiedTimeCalendarApi} from '@/utils/service/api/studied-time-server';
import React from 'react';
import layoutStyles from '@/styles/layout.module.scss';
import {H1} from '@forworkchoe/core/components';
import StudiedTimeNavigation from '@/components/service/studied-time/StudiedTimeNavigation';

export const metadata: Metadata = {
  title: 'Calendar',
  description: '공부 시간, 실패원인을 기록하고, 분석할 수 있도록 돕습니다.'
}

export default async function Page({params}: ServerComponentProps) {
  const year = Number(params.year);
  const month = Number(params.month);
  
  const weekList = await getStudiedTimeCalendarApi(year, month);

  return (
    <div className={layoutStyles.pageContentLarge}>
      <H1 className={styles.title}>{year} / {month}</H1>
      <StudiedTimeNavigation year={year} month={month}/>
      <table className={styles.table}>
        <thead>
        <tr>
          <td><span className={styles.theadTd}>MON</span></td>
          <td><span className={styles.theadTd}>TUE</span></td>
          <td><span className={styles.theadTd}>WED</span></td>
          <td><span className={styles.theadTd}>THU</span></td>
          <td><span className={styles.theadTd}>FRI</span></td>
          <td><span className={styles.theadTd}>SAT</span></td>
          <td><span className={styles.theadTd}>SUN</span></td>
        </tr>
        </thead>
        <tbody>
        {weekList.map((week, index) => (
          <tr key={index}>
            {week.map(history => (
              <StudiedCalendarCell
                key={`${history.calendarDate.month}-${history.calendarDate.date}`}
                history={history}
              />
            ))}
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
}
