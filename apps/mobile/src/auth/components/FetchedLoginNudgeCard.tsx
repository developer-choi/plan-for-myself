import {useQuery} from '@tanstack/react-query';
import LoginNudgeCard from '@/auth/components/LoginNudgeCard';
import {studyRecordStatsQueries} from '@/study-record/queries';

interface FetchedLoginNudgeCardProps {
  today: string;
}

export default function FetchedLoginNudgeCard({today}: FetchedLoginNudgeCardProps) {
  const {data: overview} = useQuery(studyRecordStatsQueries.overview.options(today));

  return <LoginNudgeCard recordedDays={overview?.totals.recordedDays ?? 0} today={today} />;
}
