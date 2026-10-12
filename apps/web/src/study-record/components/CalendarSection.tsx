'use client';

import {toast} from '@developer-choi/design-system';
import type {StudyRecord} from '@plan-for-myself/shared';
import type {CalendarMonth} from '@/study-record/calendar-date';
import {getCalendarSummaryContent} from '@/study-record/calendar-summary';
import CalendarGrid from '@/study-record/components/CalendarGrid';
import CalendarSummary from '@/study-record/components/CalendarSummary';

interface CalendarSectionProps {
  month: CalendarMonth;
  today: string;
  records: StudyRecord[];
  firstRecordDate: string;
  statsHref: string;
  handlers: {
    onRecordableDateClick: (date: string, record?: StudyRecord) => void;
  };
}

export default function CalendarSection({
  month,
  today,
  records,
  firstRecordDate,
  statsHref,
  handlers,
}: CalendarSectionProps) {
  const summary = getCalendarSummaryContent({today, month, firstRecordDate, statsHref});

  return (
    <>
      <CalendarSummary {...summary} />
      <CalendarGrid
        handlers={{
          onFutureDateClick: () => toast({title: FUTURE_DATE_MESSAGE}),
          onRecordableDateClick: handlers.onRecordableDateClick,
        }}
        month={month}
        records={records}
        today={today}
      />
    </>
  );
}

const FUTURE_DATE_MESSAGE = '오늘과 지난 날짜만 기록할 수 있어요';
