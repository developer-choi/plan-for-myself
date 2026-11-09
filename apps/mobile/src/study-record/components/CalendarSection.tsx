import type {RefObject} from 'react';
import type {View} from 'react-native';
import type {CalendarMonth} from '@plan-for-myself/shared/date';
import type {demoStatsPath} from '@plan-for-myself/shared/demo';
import {
  getCalendarSummaryContent,
  type statsPath,
  STUDY_RECORD_FIELD_MESSAGES,
  type StudyRecord,
} from '@plan-for-myself/shared/study-record';
import {toast} from 'sonner-native';
import CalendarGrid from '@/study-record/components/CalendarGrid';
import CalendarSummary from '@/study-record/components/CalendarSummary';

export interface CalendarTourTargets {
  firstRecordCell: {date: string; ref: RefObject<View | null>};
  statsLinkRef: RefObject<View | null>;
}

interface CalendarSectionProps {
  month: CalendarMonth;
  today: string;
  records: StudyRecord[];
  firstRecordDate: string;
  statsHref: ReturnType<typeof statsPath> | ReturnType<typeof demoStatsPath>;
  handlers: {
    /* 그날 기록이 없으면 record는 undefined */
    onRecordableDateClick: (date: string, record?: StudyRecord) => void;
  };
  tourTargets?: CalendarTourTargets;
}

export default function CalendarSection({
  month,
  today,
  records,
  firstRecordDate,
  statsHref,
  handlers,
  tourTargets,
}: CalendarSectionProps) {
  const summary = getCalendarSummaryContent({today, month, firstRecordDate, statsHref});

  return (
    <>
      <CalendarSummary {...summary} statsLinkRef={tourTargets?.statsLinkRef} />
      <CalendarGrid
        handlers={{
          onFutureDateClick: () => toast(STUDY_RECORD_FIELD_MESSAGES.futureDate),
          onRecordableDateClick: handlers.onRecordableDateClick,
        }}
        highlightedCell={tourTargets?.firstRecordCell}
        month={month}
        records={records}
        today={today}
      />
    </>
  );
}
