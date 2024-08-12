import styles from './page.module.scss';
import classNames from 'classnames';
import {getStudiedTimeHistoryApi} from '@/util/sevices/api/studied-time-server';
import {DailyStudyTime} from '@/type/studied-time';
import {calculateTotal} from '@/util/extend/data-type/number';
import {ServerComponentProps} from 'next';
import CustomLink from '@/component/design-system/element/link/CustomLink';
import {getDiffDate} from '@/util/extend/date/util';

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
            {week.map(date => (
              <td key={`${date.calendarDate.month}-${date.calendarDate.date}`}>
                <span className={classNames(styles.calendarDate, {[styles.notMatched]: !date.calendarDate.isMatchedMonth})}>
                  <span className={styles.dateText}>{date.calendarDate.date}</span>
                  {!date.data ? null : <StudiedHistory data={date.data}/>}
                </span>
              </td>
            ))}
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
}

function StudiedHistory({data}: {data: DailyStudyTime}) {
  const formatted = formatter(data.studied_minutes);
  const fail = data.fail_reason ? data.fail_reason : data.fail_keywords.length ? data.fail_keywords.join(',') : null;

  return (
    <>
      {!formatted ? null : <span className={styles.studiedTime}>{formatted}</span>}
      {!fail ? null : <span className={styles.failReason}>{fail}</span>}
    </>
  );
}

function formatter(studiedMinutes: DailyStudyTime['studied_minutes']): string | null {
  const total = calculateTotal(studiedMinutes, value => value);

  if (total === 0) {
    return null;
  }

  const hours = Math.floor(total / 60);
  const minutes = Math.floor(total % 60).toString().padStart(2, '0');
  return `${hours}:${minutes} (${studiedMinutes.join('+')})`
}