'use client';

import classNames from 'classnames';
import {StudiedTimeCalendarWeek} from '@/utils/service/api/studied-time';
import {DailyStudyTime, StudiedTimeCellMode} from '@/types/studied-time';
import styles from './index.module.scss';
import {useCallback, useMemo} from 'react';
import {studiedTimeFormat} from '@/utils/service/studied-time';
import {useOpenModal} from '@/utils/extend/modal';
import StudiedTimeFormModal from '@/components/modal/studied-time/StudiedTimeFormModal';
import {useSearchParams} from 'next/navigation';
import {calculateTotal} from '@/utils/extend/data-type/number';

interface StudiedCalendarCellProps {
  history: StudiedTimeCalendarWeek;
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
        initialFormData: !history.data ? undefined : {
          date_type: history.data.date_type,
          studied_minutes: {
            part1: history.data.studied_minutes?.[0].toString(),
            part2: history.data.studied_minutes?.[1].toString(),
            part3: history.data.studied_minutes?.[2].toString()
          },
          fail_keywords: history.data.fail_keywords.join(','),
          fail_reason: history.data.fail_reason ?? '',
          wake_up_time: history.data.wake_up_time,
          bed_time: history.data.bed_time
        }
      }
    });
  }, [history, openModal]);

  const searchParams = useSearchParams();
  // TODO 이런부분 유효성검증 어떻게 통일하려고했더라
  const cellMode = searchParams.get('cellMode') as StudiedTimeCellMode ?? 'default';

  const cellRender = useMemo(() => {
    if (!history.data) {
      return null;
    }

    if (calculateTotal(history.data.studied_minutes, value => value) === 0 && !history.data.fail_reason && !history.data.fail_keywords.length) {
      return (
        <SleepHistory data={history.data}/>
      );
    }

    switch (cellMode) {
      case 'sleep_time': {
        return (
          <SleepHistory data={history.data}/>
        );
      }
      
      default:
        return (
          <StudiedHistory data={history.data} summary={summary}/>
        );
    }
  }, [cellMode, history.data, summary]);

  return (
    <td onClick={onClickCell} className={classNames(styles.tdWrap, {[styles.notMatched]: !history.calendarDate.state.calendar.isMatchedMonth})}>
      <span className={classNames(styles.calendarDate)}>
        <span className={classNames(styles.dateText, {[styles.today]: history.calendarDate.state.current.isToday})}>{history.calendarDate.date}</span>
        {cellRender}
      </span>
    </td>
  );
}

function StudiedHistory({data, summary}: {data: DailyStudyTime, summary: StudiedCalendarCellProps['summary']}) {
  const formatted = studiedTimeFormat(data.studied_minutes);
  const fail = data.fail_reason ? data.fail_reason : data.fail_keywords.length ? data.fail_keywords.join(',') : null;

  return (
    <>
      {!formatted ? null : <span className={styles.primary}>{formatted}</span>}
      {!fail ? null : <span className={styles.failReason}>{fail}</span>}
      {!summary?.success ? null : (
        <span className={classNames(styles.summary)}>{summary.success}</span>
      )}
      {!summary?.fail ? null : (
        <span className={classNames(styles.summary)}>{summary.fail}</span>
      )}
    </>
  );
}

function SleepHistory({data}: {data: DailyStudyTime}) {
  const {wake_up_time, bed_time} = data;

  return (
    <>
      {!wake_up_time ? null : <span className={styles.primary}>기상 시각 : {wake_up_time}</span>}
      {!bed_time ? null : <span className={styles.secondary}>취침 시각 : {bed_time}</span>}
    </>
  );
}