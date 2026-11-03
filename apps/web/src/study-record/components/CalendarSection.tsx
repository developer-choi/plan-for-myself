'use client';

import {toast} from '@developer-choi/design-system';
import {
  type CalendarMonth,
  getCalendarSummaryContent,
  STUDY_RECORD_FIELD_MESSAGES,
  type StudyRecord,
} from '@plan-for-myself/shared';
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
          onFutureDateClick: () => toast({title: STUDY_RECORD_FIELD_MESSAGES.futureDate}),
          onRecordableDateClick: handlers.onRecordableDateClick,
        }}
        month={month}
        records={records}
        today={today}
      />
    </>
  );
}
