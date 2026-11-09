import {type CalendarMonth, STUDY_RECORD_FIELD_MESSAGES, type StudyRecord} from '@plan-for-myself/shared';
import {toast} from 'sonner-native';
import CalendarGrid from '@/study-record/components/CalendarGrid';

interface CalendarSectionProps {
  month: CalendarMonth;
  today: string;
  records: StudyRecord[];
}

export default function CalendarSection({month, today, records}: CalendarSectionProps) {
  return (
    <CalendarGrid
      handlers={{onFutureDateClick: () => toast(STUDY_RECORD_FIELD_MESSAGES.futureDate)}}
      month={month}
      records={records}
      today={today}
    />
  );
}
