'use client';

import {toast} from '@developer-choi/design-system';
import {useQuery, useSuspenseQuery} from '@tanstack/react-query';
import {type CalendarMonth, isSameMonth, toMonthParam} from '@/study-record/calendar-date';
import CalendarGrid from '@/study-record/components/CalendarGrid';
import CalendarSummary from '@/study-record/components/CalendarSummary';
import {studyRecordQueries, studyRecordStatsQueries} from '@/study-record/queries';

interface CalendarSectionProps {
  month: CalendarMonth;
  today: string;
}

export default function CalendarSection({month, today}: CalendarSectionProps) {
  const isCurrentMonth = isSameMonth(today, month);
  const {data: records} = useSuspenseQuery(studyRecordQueries.list.options(toMonthParam(month)));
  const {data: overview} = useQuery({...studyRecordStatsQueries.overview.options(today), enabled: isCurrentMonth});
  const streak = overview?.streak.current ?? 0;
  const showsSummary = isCurrentMonth && streak >= MIN_STREAK_TO_SHOW;

  return (
    <>
      {showsSummary && <CalendarSummary streak={streak} />}
      <CalendarGrid
        handlers={{onFutureDateClick: () => toast({title: FUTURE_DATE_MESSAGE})}}
        month={month}
        records={records}
        today={today}
      />
    </>
  );
}

const MIN_STREAK_TO_SHOW = 2;
const FUTURE_DATE_MESSAGE = '오늘과 지난 날짜만 기록할 수 있어요';
