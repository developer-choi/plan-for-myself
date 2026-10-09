'use client';

import FailCard from '@/study-record-stats/components/FailCard';
import {INTRO_MONTHLY} from '@/intro/intro-examples';

export default function FailurePreview() {
  return <FailCard monthly={INTRO_MONTHLY} />;
}
