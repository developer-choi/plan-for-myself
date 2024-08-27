'use client';

import classNames from 'classnames';
import {StudiedTimeHistory} from '@/utils/service/api/studied-time';
import {DailyStudyTime} from '@/types/studied-time';
import {calculateTotal} from '@/utils/extend/data-type/number';
import styles from './index.module.scss';
import {useCallback} from 'react';
import {studiedTimeFormat} from '@/utils/service/studied-time';
import {useOpenModal} from '@/utils/extend/modal';
import StudiedTimeFormModal from '@/components/modal/studied-time/StudiedTimeFormModal';

interface StudiedCalendarCellProps {
  history: StudiedTimeHistory;
  summary?: {
    success?: string; //한달내내 공부안했으면 없음
    fail?: string; //한달내내 실패 안했으면 없음
  };
}

export default function StudiedCalendarCell({history, summary}: StudiedCalendarCellProps) {
  const {openModal} = useOpenModal();

  const onClickCell = useCallback(() => {
    openModal({
      Component: StudiedTimeFormModal,
      props: {
        history,
        initialFormData: {
          date_type: history.data?.date_type ?? 'quarter',
          studied_minutes: {
            part1: history.data?.studied_minutes?.[0].toString() ?? '',
            part2: history.data?.studied_minutes?.[1].toString() ?? '',
            part3: history.data?.studied_minutes?.[2].toString() ?? ''
          },
          fail_keywords: history.data?.fail_keywords.join(',') ?? '',
          fail_reason: history.data?.fail_reason ?? ''
        }
      }
    });
  }, [history, openModal]);

  return (
    <td onClick={onClickCell} className={styles.tdWrap}>
      <span className={classNames(styles.calendarDate, {[styles.notMatched]: !history.calendarDate.state.calendar.isMatchedMonth})}>
        <span className={classNames(styles.dateText, {[styles.thisWeek]: history.calendarDate.state.current.isThisWeek}, {[styles.today]: history.calendarDate.state.current.isToday})}>{history.calendarDate.date}</span>
        {!history.data ? null : <StudiedHistory data={history.data}/>}
        {!summary?.success ? null : (
          <span className={classNames(styles.summary, styles.success)}>{summary.success}</span>
        )}
        {!summary?.fail ? null : (
          <span className={classNames(styles.summary, styles.fail)}>{summary.fail}</span>
        )}
      </span>
    </td>
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

  return `${studiedTimeFormat(total)} (${studiedMinutes.join('+')})`;
}
