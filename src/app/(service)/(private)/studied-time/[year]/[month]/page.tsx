import styles from './page.module.scss';
import {Metadata, ServerComponentProps} from 'next';
import StudiedCalendarCell from '@/components/service/studied-time/StudiedCalendarCell';
import {calculateTotal, classifyStrings, sortByNumber} from '@forworkchoe/core/utils';
import {getStudiedTimeCalendarApi, StudiedTimeCalendarWeek} from '@/utils/service/api/studied-time-server';
import {minutesFormat} from '@/utils/service/studied-time';
import React from 'react';
import StudiedTimeSetting from '@/components/service/studied-time/StudiedTimeSetting';
import StudiedStatistics from '@/components/service/studied-time/statistics/StudiedStatistics';
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
  const haveData = weekList.some(week => week.some(({data}) => data));

  return (
    <div className={layoutStyles.pageContentLarge}>
      <H1 className={styles.title}>{year} / {month}</H1>
      <StudiedTimeNavigation year={year} month={month}/>
      <StudiedTimeSetting/>
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
                summary={!history.calendarDate.state.calendar.isLastDate ? undefined : getThisMonthSummary(weekList)}
              />
            ))}
          </tr>
        ))}
        </tbody>
      </table>
      {!haveData ? null : (
        <StudiedStatistics year={year} month={month}/>
      )}
    </div>
  );
}

function getThisMonthSummary(weekList: StudiedTimeCalendarWeek[][]) {
  const {totalKeywords, totalMinutes} = weekList.flat().reduce((a, b) => {
    if (!b.data || !b.calendarDate.state.calendar.isMatchedMonth) {
      return a;
    }

    if (b.data.fail_keywords.length > 1 || b.data.fail_keywords[0] !== '') {
      a.totalKeywords = a.totalKeywords.concat(b.data.fail_keywords);
    }

    a.totalMinutes += calculateTotal(b.data.studied_minutes, value => value);
    return a;
  }, {
    totalMinutes: 0,
    totalKeywords: [] as string[]
  });

  const top3Keywords = sortByNumber('desc', classifyStrings(totalKeywords), ({count}) => count).slice(0, 3).map(({value, count}) => `${value}${count}`);

  return {
    success: totalMinutes === 0 ? undefined : minutesFormat(totalMinutes),
    fail: top3Keywords.length === 0 ? undefined : top3Keywords.join(' / ')
  };
}
