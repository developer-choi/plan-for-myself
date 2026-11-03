import {type RefObject, useRef} from 'react';
import type {ScrollView, View} from 'react-native';
import {
  type CalendarMonth,
  getTagCalendar,
  shouldShowDemoStatsTour,
  type StudyRecord,
  type StudyRecordMonthly,
  type StudyRecordOverview,
} from '@plan-for-myself/shared';
import DemoTourTrigger from '@/demo/components/DemoTourTrigger';
import StatsSection, {type StatsTourTargets} from '@/study-record-stats/components/StatsSection';
import TagCalendar from '@/study-record-stats/components/TagCalendar';

interface DemoStatsSectionProps {
  month: CalendarMonth;
  records: StudyRecord[];
  monthly: StudyRecordMonthly;
  /* 누적·연속 기록은 이번 달에만 보여 주므로 지난 달이면 null */
  overview: StudyRecordOverview | null;
  scrollViewRef: RefObject<ScrollView | null>;
}

export default function DemoStatsSection({month, records, monthly, overview, scrollViewRef}: DemoStatsSectionProps) {
  const failGroupsRef = useRef<View>(null);
  const firstTagRowRef = useRef<View>(null);
  const tagDetailCardRef = useRef<View>(null);
  const firstTagOpenerRef: StatsTourTargets['firstTagOpenerRef'] = useRef(null);
  const tourTargets = {failGroupsRef, firstTagRowRef, tagDetailCardRef, firstTagOpenerRef};

  return (
    <>
      <StatsSection
        monthly={monthly}
        overview={overview}
        renderTagCalendar={(tag) => <TagCalendar calendar={getTagCalendar({month, records, tag})} />}
        scrollViewRef={scrollViewRef}
        tourTargets={tourTargets}
      />
      {shouldShowDemoStatsTour(monthly) && <DemoTourTrigger part="stats" targets={tourTargets} />}
    </>
  );
}
