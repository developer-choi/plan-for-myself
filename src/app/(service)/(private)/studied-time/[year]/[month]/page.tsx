import styles from './page.module.scss';
import {getStudiedTimeHistoryApi, StudiedTimeHistory} from '@/util/sevices/api/studied-time-server';
import {Metadata, ServerComponentProps} from 'next';
import CustomLink from '@/component/design-system/element/link/CustomLink';
import {getDiffDate} from '@/util/extend/date/util';
import StudiedCalendarCell from '@/component/services/studied-time/StudiedCalendarCell';
import {calculateTotal} from '@/util/extend/data-type/number';
import {studiedTimeFormat} from '@/util/sevices/studied-time';
import {classifyStrings} from '@/util/extend/data-type/string';
import {sortByNumber} from '@/util/extend/data-type/array';

export const metadata: Metadata = {
  title: 'Calendar',
  description: '공부 시간, 실패원인을 기록하고, 분석할 수 있도록 돕습니다.'
}

export default async function Page({params}: ServerComponentProps) {
  const year = Number(params.year);
  const month = Number(params.month);

  const previousMonth = getDiffDate(new Date(year, month - 1), [0, -1]);
  const nextMonth = getDiffDate(new Date(year, month - 1), [0, 1]);

  const weekList = await getStudiedTimeHistoryApi(year, month);

  return (
    <div className={styles.pageWrap}>
      <h1 className={styles.h1}>{year} / {month}</h1>
      <div className={styles.navigator}>
        <CustomLink href={`/studied-time/${previousMonth.getFullYear()}/${previousMonth.getMonth() + 1}`}>Previous</CustomLink>
        <CustomLink href={`/studied-time/${nextMonth.getFullYear()}/${nextMonth.getMonth() + 1}`}>Next</CustomLink>
      </div>
      <table className={styles.table}>
        <thead>
        <tr>
          <td><span className={styles.calendarDate}>MON</span></td>
          <td><span className={styles.calendarDate}>TUE</span></td>
          <td><span className={styles.calendarDate}>WED</span></td>
          <td><span className={styles.calendarDate}>THU</span></td>
          <td><span className={styles.calendarDate}>FRI</span></td>
          <td><span className={styles.calendarDate}>SAT</span></td>
          <td><span className={styles.calendarDate}>SUN</span></td>
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
    </div>
  );
}

function getThisMonthSummary(weekList: StudiedTimeHistory[][]) {
  const {totalKeywords, totalMinutes} = weekList.flat().reduce((a, b) => {
    if (!b.data || !b.calendarDate.state.calendar.isMatchedMonth) {
      return a;
    }

    a.totalMinutes += calculateTotal(b.data.studied_minutes, value => value);
    a.totalKeywords = a.totalKeywords.concat(b.data.fail_keywords);
    return a;
  }, {
    totalMinutes: 0,
    totalKeywords: [] as string[]
  });

  const top3Keywords = sortByNumber('desc', classifyStrings(totalKeywords), ({count}) => count).slice(0, 3).map(({value, count}) => `${value}${count}`);

  return {
    success: totalMinutes === 0 ? undefined : studiedTimeFormat(totalMinutes),
    fail: top3Keywords.length === 0 ? undefined : top3Keywords.join(' / ')
  };
}
