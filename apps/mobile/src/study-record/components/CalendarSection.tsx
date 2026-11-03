import {type CalendarMonth, STUDY_RECORD_FIELD_MESSAGES, type StudyRecord} from '@plan-for-myself/shared';
import {toast} from 'sonner-native';
import CalendarGrid from '@/study-record/components/CalendarGrid';

interface CalendarSectionProps {
  month: CalendarMonth;
  today: string;
  records: StudyRecord[];
  handlers: {
    /* 그날 기록이 없으면 record는 undefined */
    onRecordableDateClick: (date: string, record?: StudyRecord) => void;
  };
}

export default function CalendarSection({month, today, records, handlers}: CalendarSectionProps) {
  return (
    <CalendarGrid
      handlers={{
        onFutureDateClick: () => toast(STUDY_RECORD_FIELD_MESSAGES.futureDate),
        onRecordableDateClick: handlers.onRecordableDateClick,
      }}
      month={month}
      records={records}
      today={today}
    />
  );
}
