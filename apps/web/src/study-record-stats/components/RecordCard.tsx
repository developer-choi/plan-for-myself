import type {StudyRecordMonthly, StudyRecordOverview} from '@plan-for-myself/shared';
import Card from '@/shared/components/Card';
import StatList, {StatListItem, StatSentence, StatValue} from '@/study-record-stats/components/StatList';
import {countMissedDays, formatMonthLabel, formatStreakNote} from '@/study-record-stats/format';

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
  const hasStreak = streak !== null;

  return (
    <Card title="기록">
      <StatList>
        {hasStreak && (
          <StatListItem
            label="연속 기록"
            note={formatStreakNote(streak)}
            value={<StatValue>{streak.current}일</StatValue>}
          />
        )}
        <StatListItem
          label={`${formatMonthLabel(monthly.month)} 기록`}
          value={<RecordedDaysSentence recordedDays={monthly.recordedDays} />}
        />
        {totalRecordedDays !== null && (
          <StatListItem
            label="누적 기록"
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
    return <StatSentence>오늘 첫 기록을 남겨 보세요</StatSentence>;
  }
  if (missedDays === 0) {
    return <StatSentence>빠짐없이 남겼어요</StatSentence>;
  }
  return (
    <StatSentence>
      남기지 못한 날이 <StatValue>{missedDays}일</StatValue> 있어요
    </StatSentence>
  );
}
