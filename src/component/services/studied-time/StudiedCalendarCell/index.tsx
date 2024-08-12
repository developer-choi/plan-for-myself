'use client';

import classNames from 'classnames';
import {StudiedTimeHistory} from '@/util/sevices/api/studied-time-server';
import {DailyStudyTime} from '@/type/studied-time';
import {calculateTotal} from '@/util/extend/data-type/number';
import styles from './index.module.scss';
import {useCallback} from 'react';
import {useDispatchOpenModal} from '@/store/reducers/modal';

interface StudiedCalendarCellProps {
  history: StudiedTimeHistory;
}

export default function StudiedCalendarCell({history}: StudiedCalendarCellProps) {
  const {openStudiedTimeFormModal} = useDispatchOpenModal();

  const onClickCell = useCallback(() => {
    openStudiedTimeFormModal({
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
    });
  }, [history, openStudiedTimeFormModal]);

  return (
    <td onClick={onClickCell} className={styles.tdWrap}>
      <span className={classNames(styles.calendarDate, {[styles.notMatched]: !history.calendarDate.isMatchedMonth})}>
        <span className={styles.dateText}>{history.calendarDate.date}</span>
        {!history.data ? null : <StudiedHistory data={history.data}/>}
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

  const hours = Math.floor(total / 60);
  const minutes = Math.floor(total % 60).toString().padStart(2, '0');
  return `${hours}:${minutes} (${studiedMinutes.join('+')})`;
}
