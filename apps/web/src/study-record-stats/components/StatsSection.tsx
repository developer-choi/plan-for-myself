'use client';

import type {StudyRecordMonthly} from '@plan-for-myself/shared';
import {Suspense, useEffect, useRef, useState} from 'react';
import {useSuspenseQuery} from '@tanstack/react-query';
import {type CalendarMonth, isSameMonth, toMonthParam} from '@/study-record/calendar-date';
import {studyRecordStatsQueries} from '@/study-record/queries';
import HandledErrorBoundary from '@/shared/components/HandledErrorBoundary';
import LoadingSpinner from '@/shared/components/LoadingSpinner';
import CumulativeStrip from '@/study-record-stats/components/CumulativeStrip';
import FailCard from '@/study-record-stats/components/FailCard';
import FetchedTagCalendar from '@/study-record-stats/components/FetchedTagCalendar';
import RecordCard from '@/study-record-stats/components/RecordCard';
import StudyCard from '@/study-record-stats/components/StudyCard';
import TagDetailCard from '@/study-record-stats/components/TagDetailCard';
import {toTrendBars} from '@/study-record-stats/tag-detail';

interface StatsSectionProps {
  month: CalendarMonth;
  today: string;
}

interface MonthlyCardsProps {
  month: CalendarMonth;
  monthly: StudyRecordMonthly;
  today: string;
}

export default function StatsSection({month, today}: StatsSectionProps) {
  const isCurrentMonth = isSameMonth(today, month);
  const {data: monthly} = useSuspenseQuery(studyRecordStatsQueries.monthly.options(toMonthParam(month), today));

  return (
    <>
      {isCurrentMonth ? (
        <CurrentMonthCards month={month} monthly={monthly} today={today} />
      ) : (
        <>
          <FailSection month={month} monthly={monthly} today={today} />
          <RecordCard monthly={monthly} streak={null} />
        </>
      )}
      <StudyCard monthly={monthly} />
    </>
  );
}

function CurrentMonthCards({month, monthly, today}: MonthlyCardsProps) {
  const {data: overview} = useSuspenseQuery(studyRecordStatsQueries.overview.options(today));

  return (
    <>
      <CumulativeStrip monthly={monthly} totals={overview.totals} />
      <FailSection month={month} monthly={monthly} today={today} />
      <RecordCard monthly={monthly} streak={overview.streak} />
    </>
  );
}

function FailSection({month, monthly, today}: MonthlyCardsProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  /* 카드가 그려진 뒤에야 ref가 채워지므로 렌더가 끝난 뒤 스크롤한다 */
  useEffect(() => {
    if (selectedTag !== null) {
      detailRef.current?.scrollIntoView({behavior: 'smooth', block: 'start'});
    }
  }, [selectedTag]);

  const selectTag = (tag: string) => {
    setSelectedTag((current) => (current === tag ? null : tag));
  };

  const selectedFailure = monthly.failureTags.find(({tag}) => tag === selectedTag);

  return (
    <>
      <FailCard monthly={monthly} selection={{selectedTag, onSelect: selectTag}} />
      {selectedFailure && (
        <TagDetailCard
          ref={detailRef}
          calendar={
            <HandledErrorBoundary size="card">
              <Suspense fallback={<LoadingSpinner size="card" />}>
                <FetchedTagCalendar month={month} tag={selectedFailure.tag} today={today} />
              </Suspense>
            </HandledErrorBoundary>
          }
          month={month.month}
          tag={selectedFailure.tag}
          trend={{bars: toTrendBars(selectedFailure.trend), inProgress: monthly.inProgress}}
        />
      )}
    </>
  );
}
