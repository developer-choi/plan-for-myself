'use client';

import type {StudyRecordMonthly} from '@plan-for-myself/shared';
import {useSuspenseQuery} from '@tanstack/react-query';
import {type CalendarMonth, isSameMonth, toMonthParam} from '@/study-record/calendar-date';
import {studyRecordStatsQueries} from '@/study-record/queries';
import CumulativeStrip from '@/study-record-stats/components/CumulativeStrip';
import RecordCard from '@/study-record-stats/components/RecordCard';
import StudyCard from '@/study-record-stats/components/StudyCard';

interface StatsSectionProps {
  month: CalendarMonth;
  today: string;
}

interface CurrentMonthCardsProps {
  monthly: StudyRecordMonthly;
  today: string;
}

export default function StatsSection({month, today}: StatsSectionProps) {
  const isCurrentMonth = isSameMonth(today, month);
  const {data: monthly} = useSuspenseQuery(studyRecordStatsQueries.monthly.options(toMonthParam(month), today));

  return (
    <>
      {isCurrentMonth ? (
        <CurrentMonthCards monthly={monthly} today={today} />
      ) : (
        <RecordCard monthly={monthly} streak={null} />
      )}
      <StudyCard monthly={monthly} />
    </>
  );
}

function CurrentMonthCards({monthly, today}: CurrentMonthCardsProps) {
  const {data: overview} = useSuspenseQuery(studyRecordStatsQueries.overview.options(today));

  return (
    <>
      <CumulativeStrip monthly={monthly} totals={overview.totals} />
      <RecordCard monthly={monthly} streak={overview.streak} />
    </>
  );
}
