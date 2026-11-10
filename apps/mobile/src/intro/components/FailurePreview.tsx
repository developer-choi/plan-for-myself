import {INTRO_MONTHLY} from '@plan-for-myself/shared';
import FailCard from '@/study-record-stats/components/FailCard';

export default function FailurePreview() {
  return <FailCard monthly={INTRO_MONTHLY} />;
}
