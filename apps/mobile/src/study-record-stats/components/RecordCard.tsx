import {
  countMissedDays,
  formatMonthRecordLabel,
  formatStreakNote,
  STATS_TEXT,
} from '@plan-for-myself/shared/study-record-stats';
import type {StudyRecordMonthly, StudyRecordOverview} from '@plan-for-myself/shared/study-record';
import Card from '@/shared/components/Card';
import StatList, {StatListItem, StatSentence, StatValue} from '@/study-record-stats/components/StatList';

interface RecordCardProps {
  /* 지난 달 통계면 null — 지금 기준 값(연속 기록·역대 최장)은 이번 달에서만 보인다 */
  streak: StudyRecordOverview['streak'] | null;
  /* 지난 달 통계면 null — 지금까지 기록한 날 수도 지금 기준 값이다 */
  totalRecordedDays: number | null;
  monthly: StudyRecordMonthly;
}

interface RecordedDaysSentenceProps {
  recordedDays: StudyRecordMonthly['recordedDays'];
}

export default function RecordCard({streak, totalRecordedDays, monthly}: RecordCardProps) {
  return (
    <Card title={STATS_TEXT.recordCardTitle}>
      <StatList>
        {streak !== null && (
          <StatListItem
            label={STATS_TEXT.streakLabel}
            note={formatStreakNote(streak)}
            value={<StatValue>{streak.current}일</StatValue>}
          />
        )}
        <StatListItem
          label={formatMonthRecordLabel(monthly.month)}
          value={<RecordedDaysSentence recordedDays={monthly.recordedDays} />}
        />
        {totalRecordedDays !== null && (
          <StatListItem
            label={STATS_TEXT.totalRecordLabel}
            value={<StatValue>{totalRecordedDays.toLocaleString('ko-KR')}일</StatValue>}
          />
        )}
      </StatList>
    </Card>
  );
}

function RecordedDaysSentence({recordedDays}: RecordedDaysSentenceProps) {
  const missedDays = countMissedDays(recordedDays);

  if (missedDays === null) {
    return <StatSentence>{STATS_TEXT.recordFirstToday}</StatSentence>;
  }
  if (missedDays === 0) {
    return <StatSentence>{STATS_TEXT.recordNoMissedDays}</StatSentence>;
  }
  return (
    <StatSentence>
      {STATS_TEXT.missedDaysPrefix} <StatValue>{missedDays}일</StatValue> {STATS_TEXT.missedDaysSuffix}
    </StatSentence>
  );
}
