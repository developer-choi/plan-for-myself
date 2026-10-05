import type {StudyRecordMonthly, StudyRecordOverview} from '@plan-for-myself/shared';
import Card from '@/shared/components/Card';
import StatList, {StatListItem} from '@/study-record-stats/components/StatList';
import {formatMonthLabel, formatStreakNote} from '@/study-record-stats/format';

interface RecordCardProps {
  /* 지난 달 통계면 null — 지금 기준 값(연속 기록·역대 최장)은 이번 달에서만 보인다 */
  streak: StudyRecordOverview['streak'] | null;
  monthly: StudyRecordMonthly;
}

export default function RecordCard({streak, monthly}: RecordCardProps) {
  const hasStreak = streak !== null;
  const {recordedDays, previousRecordedDays} = monthly;

  return (
    <Card title="기록">
      <StatList>
        {hasStreak && <StatListItem label="연속 기록" note={formatStreakNote(streak)} value={`${streak.current}일`} />}
        <StatListItem
          label={`${formatMonthLabel(monthly.month)} 기록한 날`}
          note={
            previousRecordedDays === null
              ? undefined
              : `지난달 ${previousRecordedDays.count} / ${previousRecordedDays.total}`
          }
          value={`${recordedDays.count} / ${recordedDays.total}일`}
        />
      </StatList>
    </Card>
  );
}
