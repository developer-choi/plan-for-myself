import {
  type CalendarMonth,
  getCalendarSummaryContent,
  type statsPath,
  STUDY_RECORD_FIELD_MESSAGES,
  type StudyRecord,
} from '@plan-for-myself/shared';
import {toast} from 'sonner-native';
import CalendarGrid from '@/study-record/components/CalendarGrid';
import CalendarSummary from '@/study-record/components/CalendarSummary';

interface CalendarSectionProps {
  month: CalendarMonth;
  today: string;
  records: StudyRecord[];
  firstRecordDate: string;
  statsHref: ReturnType<typeof statsPath>;
  handlers: {
    /* 그날 기록이 없으면 record는 undefined */
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
          onFutureDateClick: () => toast(STUDY_RECORD_FIELD_MESSAGES.futureDate),
          onRecordableDateClick: handlers.onRecordableDateClick,
        }}
        month={month}
        records={records}
        today={today}
      />
    </>
  );
}
