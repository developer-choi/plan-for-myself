'use client';

import {toast} from '@developer-choi/design-system';
import type {StudyRecord} from '@plan-for-myself/shared';
import {useSuspenseQueries} from '@tanstack/react-query';
import {overlay} from 'overlay-kit';
import {type CalendarMonth, toMonthParam} from '@/study-record/calendar-date';
import {getCalendarSummaryContent} from '@/study-record/calendar-summary';
import CalendarGrid from '@/study-record/components/CalendarGrid';
import CalendarRecordFormDialog from '@/study-record/components/CalendarRecordFormDialog';
import CalendarSummary from '@/study-record/components/CalendarSummary';
import FirstRecord from '@/study-record/components/FirstRecord';
import {studyRecordQueries, studyRecordStatsQueries} from '@/study-record/queries';

interface CalendarSectionProps {
  month: CalendarMonth;
  today: string;
}

export default function CalendarSection({month, today}: CalendarSectionProps) {
  const [{data: records}, {data: overview}] = useSuspenseQueries({
    queries: [studyRecordQueries.list.options(toMonthParam(month)), studyRecordStatsQueries.overview.options(today)],
  });

  if (overview.firstRecordDate === null) {
    return <FirstRecord today={today} />;
  }

  const summary = getCalendarSummaryContent({
    today,
    month,
    streak: overview.streak.current,
    firstRecordDate: overview.firstRecordDate,
  });

  const openRecordForm = (date: string, record?: StudyRecord) => {
    overlay.open(({isOpen, unmount}) => (
      <CalendarRecordFormDialog
        date={date}
        isOpen={isOpen}
        month={toMonthParam(month)}
        record={record}
        onClose={unmount}
      />
    ));
  };

  return (
    <>
      <CalendarSummary {...summary} />
      <CalendarGrid
        handlers={{
          onFutureDateClick: () => toast({title: FUTURE_DATE_MESSAGE}),
          onRecordableDateClick: openRecordForm,
        }}
        month={month}
        records={records}
        today={today}
      />
    </>
  );
}

const FUTURE_DATE_MESSAGE = '오늘과 지난 날짜만 기록할 수 있어요';
