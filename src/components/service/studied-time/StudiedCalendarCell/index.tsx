import classNames from 'classnames';
import {StudiedTimeCalendarWeek} from '@/utils/service/api/studied-time-server';
import {DailyStudyTime} from '@/types/studied-time';
import styles from './index.module.scss';
import {studiedTimeFormat} from '@/utils/service/studied-time';

interface StudiedCalendarCellProps {
  history: StudiedTimeCalendarWeek;
}

export default function StudiedCalendarCell({history}: StudiedCalendarCellProps) {
  return (
    <td className={classNames(styles.tdWrap, {[styles.notMatched]: !history.calendarDate.state.calendar.isMatchedMonth})}>
      <span className={classNames(styles.calendarDate)}>
        <span className={classNames(styles.dateText, {[styles.today]: history.calendarDate.state.current.isToday})}>{history.calendarDate.date}</span>
        {!history.data ? null : (
          <StudiedHistory data={history.data}/>
        )}
      </span>
    </td>
  );
}

function StudiedHistory({data}: {data: DailyStudyTime}) {
  const formatted = studiedTimeFormat(data.studied_minutes);
  const fail = data.fail_keywords.length ? data.fail_keywords.join(',') : null;

  return (
    <>
      {!formatted ? null : <span className={styles.primary}>{formatted}</span>}
      {!fail ? null : <span className={styles.failReason}>{fail}</span>}
    </>
  );
}
