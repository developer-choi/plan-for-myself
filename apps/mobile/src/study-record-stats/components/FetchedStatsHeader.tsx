import type {CalendarMonth} from '@plan-for-myself/shared';
import {useQuery} from '@tanstack/react-query';
import {studyRecordStatsQueries} from '@/study-record/queries';
import StatsPageHeader from '@/study-record-stats/components/StatsPageHeader';

interface FetchedStatsHeaderProps {
  month: CalendarMonth;
  today: string;
}

export default function FetchedStatsHeader({month, today}: FetchedStatsHeaderProps) {
  const {data: overview} = useQuery(studyRecordStatsQueries.overview.options(today));

  return <StatsPageHeader firstRecordDate={overview?.firstRecordDate ?? null} month={month} today={today} />;
}
