'use client';

import type {StudyRecordMonthly, StudyRecordOverview} from '@plan-for-myself/shared';
import {type ReactNode, useEffect, useRef, useState} from 'react';
import type {CalendarMonth} from '@/study-record/calendar-date';
import CumulativeStrip from '@/study-record-stats/components/CumulativeStrip';
import FailCard from '@/study-record-stats/components/FailCard';
import RecordCard from '@/study-record-stats/components/RecordCard';
import StudyCard from '@/study-record-stats/components/StudyCard';
import TagDetailCard from '@/study-record-stats/components/TagDetailCard';
import {toTrendBars} from '@/study-record-stats/tag-detail';

interface StatsSectionProps {
  month: CalendarMonth;
  monthly: StudyRecordMonthly;
  /* 누적·연속 기록은 이번 달에만 보여 주므로 지난 달이면 null */
  overview: StudyRecordOverview | null;
  renderTagCalendar: (tag: string) => ReactNode;
}

interface FailSectionProps {
  month: CalendarMonth;
  monthly: StudyRecordMonthly;
  renderTagCalendar: (tag: string) => ReactNode;
}

export default function StatsSection({month, monthly, overview, renderTagCalendar}: StatsSectionProps) {
  return (
    <>
      {overview ? (
        <>
          <CumulativeStrip monthly={monthly} totals={overview.totals} />
          <FailSection month={month} monthly={monthly} renderTagCalendar={renderTagCalendar} />
          <RecordCard monthly={monthly} streak={overview.streak} />
        </>
      ) : (
        <>
          <FailSection month={month} monthly={monthly} renderTagCalendar={renderTagCalendar} />
          <RecordCard monthly={monthly} streak={null} />
        </>
      )}
      <StudyCard monthly={monthly} />
    </>
  );
}

function FailSection({month, monthly, renderTagCalendar}: FailSectionProps) {
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
          calendar={renderTagCalendar(selectedFailure.tag)}
          month={month.month}
          tag={selectedFailure.tag}
          trend={{bars: toTrendBars(selectedFailure.trend), inProgress: monthly.inProgress}}
        />
      )}
    </>
  );
}
