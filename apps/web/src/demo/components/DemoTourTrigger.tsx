'use client';

import dynamic from 'next/dynamic';
import {captureException} from '@sentry/nextjs';
import {ErrorBoundary} from 'react-error-boundary';

interface DemoTourTriggerProps {
  part: 'calendar' | 'stats';
}

export default function DemoTourTrigger({part}: DemoTourTriggerProps) {
  return (
    <ErrorBoundary fallback={null} onError={(error) => captureException(error)}>
      {part === 'calendar' ? <DemoCalendarTour /> : null}
    </ErrorBoundary>
  );
}

const DemoCalendarTour = dynamic(() => import('@/demo/components/DemoCalendarTour'), {ssr: false});
