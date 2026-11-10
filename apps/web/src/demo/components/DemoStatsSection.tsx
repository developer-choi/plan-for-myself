'use client';

import {
  type CalendarMonth,
  getTagCalendar,
  type StudyRecord,
  type StudyRecordMonthly,
  type StudyRecordOverview,
} from '@plan-for-myself/shared';
import StatsSection from '@/study-record-stats/components/StatsSection';
import TagCalendar from '@/study-record-stats/components/TagCalendar';

interface DemoStatsSectionProps {
  month: CalendarMonth;
  records: StudyRecord[];
  monthly: StudyRecordMonthly;
  /* 누적·연속 기록은 이번 달에만 보여 주므로 지난 달이면 null */
  overview: StudyRecordOverview | null;
}

export default function DemoStatsSection({month, records, monthly, overview}: DemoStatsSectionProps) {
  return (
    <StatsSection
      monthly={monthly}
      overview={overview}
      renderTagCalendar={(tag) => <TagCalendar calendar={getTagCalendar({month, records, tag})} />}
    />
  );
}
