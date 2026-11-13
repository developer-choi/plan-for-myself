import type {CalendarMonth} from '@plan-for-myself/shared/date';
import {useSuspenseQuery} from '@tanstack/react-query';
import DemoStatsHeader from '@/demo/components/DemoStatsHeader';
import {demoQueries} from '@/demo/queries';

interface FetchedDemoStatsHeaderProps {
  month: CalendarMonth;
}

export default function FetchedDemoStatsHeader({month}: FetchedDemoStatsHeaderProps) {
  const {
    data: {today, overview},
  } = useSuspenseQuery(demoQueries.thisMonth.options());

  return <DemoStatsHeader firstRecordDate={overview.firstRecordDate} month={month} today={today} />;
}
