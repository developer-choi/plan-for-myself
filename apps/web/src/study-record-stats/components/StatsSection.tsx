'use client';

import {type StudyRecordMonthly, type StudyRecordOverview, toTrendBars} from '@plan-for-myself/shared';
import {useSelectedFailureTag} from '@plan-for-myself/shared/react';
import {type ReactNode, useRef} from 'react';
import FailCard from '@/study-record-stats/components/FailCard';
import RecordCard from '@/study-record-stats/components/RecordCard';
import StudyCard from '@/study-record-stats/components/StudyCard';
import TagDetailCard from '@/study-record-stats/components/TagDetailCard';
import styles from './StatsSection.module.scss';

interface StatsSectionProps {
  monthly: StudyRecordMonthly;
  /* 누적·연속 기록은 이번 달에만 보여 주므로 지난 달이면 null */
  overview: StudyRecordOverview | null;
  renderTagCalendar: (tag: string) => ReactNode;
}

interface FailSectionProps {
  monthly: StudyRecordMonthly;
  renderTagCalendar: (tag: string) => ReactNode;
}

export default function StatsSection({monthly, overview, renderTagCalendar}: StatsSectionProps) {
  return (
    <div className={styles.cards}>
      <FailSection monthly={monthly} renderTagCalendar={renderTagCalendar} />
      <RecordCard
        monthly={monthly}
        streak={overview?.streak ?? null}
        totalRecordedDays={overview?.totals.recordedDays ?? null}
      />
      <StudyCard monthly={monthly} totalStudiedMinutes={overview?.totals.studiedMinutes ?? null} />
    </div>
  );
}

function FailSection({monthly, renderTagCalendar}: FailSectionProps) {
  const detailRef = useRef<HTMLDivElement>(null);
  const {selection, selectedFailure} = useSelectedFailureTag({
    failureTags: monthly.failureTags,
    onOpen: () => detailRef.current?.scrollIntoView({behavior: 'smooth', block: 'start'}),
  });

  return (
    <>
      <FailCard monthly={monthly} selection={selection} />
      {selectedFailure && (
        <TagDetailCard
          ref={detailRef}
          calendar={renderTagCalendar(selectedFailure.tag)}
          tag={selectedFailure.tag}
          trend={{bars: toTrendBars(selectedFailure.trend), inProgress: monthly.inProgress}}
        />
      )}
    </>
  );
}
