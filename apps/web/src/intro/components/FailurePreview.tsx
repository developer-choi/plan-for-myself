'use client';

import FailCard from '@/study-record-stats/components/FailCard';
import {INTRO_MONTHLY} from '@plan-for-myself/shared/intro';

export default function FailurePreview() {
  return <FailCard monthly={INTRO_MONTHLY} />;
}
