'use client';

import type {StudyRecord, StudyRecordMonthly, StudyRecordOverview} from '@plan-for-myself/shared';
import type {CalendarMonth} from '@/study-record/calendar-date';
import StatsSection from '@/study-record-stats/components/StatsSection';
import TagCalendar from '@/study-record-stats/components/TagCalendar';
import {getTagCalendar} from '@/study-record-stats/tag-detail';

interface DemoStatsSectionProps {
  month: CalendarMonth;
  today: string;
  records: StudyRecord[];
  monthly: StudyRecordMonthly;
  /* 누적·연속 기록은 이번 달에만 보여 주므로 지난 달이면 null */
  overview: StudyRecordOverview | null;
}

export default function DemoStatsSection({month, today, records, monthly, overview}: DemoStatsSectionProps) {
  return (
    <StatsSection
      month={month}
      monthly={monthly}
      overview={overview}
      renderTagCalendar={(tag) => <TagCalendar calendar={getTagCalendar({month, today, records, tag})} />}
    />
  );
}
