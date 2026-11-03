import {INTRO_MONTHLY, INTRO_STREAK} from '@plan-for-myself/shared';
import RecordCard from '@/study-record-stats/components/RecordCard';

export default function StreakPreview() {
  return <RecordCard monthly={INTRO_MONTHLY} streak={INTRO_STREAK} totalRecordedDays={null} />;
}
