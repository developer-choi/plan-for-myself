'use client';

import classNames from 'classnames';
import {StudiedTimeCalendarWeek} from '@/utils/service/api/studied-time-server';
import {DailyStudyTime} from '@/types/studied-time';
import styles from './index.module.scss';
import {useCallback} from 'react';
import {studiedTimeFormat} from '@/utils/service/studied-time';
import {useModal} from '@forworkchoe/core/hooks';
import StudiedTimeFormModal from '@/components/modal/studied-time/StudiedTimeFormModal';

interface StudiedCalendarCellProps {
  history: StudiedTimeCalendarWeek;
}

export default function StudiedCalendarCell({history}: StudiedCalendarCellProps) {
  const modal = useModal();

  const onClickCell = useCallback(() => {
    modal.open.custom({
      Component: StudiedTimeFormModal,
      props: {
        history,
        initialFormData: !history.data ? undefined : {
          date_type: history.data.date_type,
          studied_minutes: {
            part1: history.data.studied_minutes?.[0].toString(),
            part2: history.data.studied_minutes?.[1].toString(),
            part3: history.data.studied_minutes?.[2].toString()
          },
          fail_keywords: history.data.fail_keywords.join(',')
        }
      }
    });
  }, [history, modal.open]);

  return (
    <td onClick={onClickCell} className={classNames(styles.tdWrap, {[styles.notMatched]: !history.calendarDate.state.calendar.isMatchedMonth})}>
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
