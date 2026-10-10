'use client';

import {useEffect, useState, useSyncExternalStore} from 'react';
import dynamic from 'next/dynamic';
import {captureException} from '@sentry/nextjs';
import {ErrorBoundary} from 'react-error-boundary';
import {type DemoTourPart, hasSeenDemoTour, markDemoTourSeen} from '@/demo/demo-tour-seen';

interface DemoTourTriggerProps {
  part: DemoTourPart;
}

export default function DemoTourTrigger({part}: DemoTourTriggerProps) {
  const [getVisible] = useState(() => createVisibleSnapshot(part));
  const visible = useSyncExternalStore(subscribeNothing, getVisible, getServerVisible);

  useEffect(() => {
    if (visible) {
      markDemoTourSeen(part);
    }
  }, [part, visible]);

  if (!visible) {
    return null;
  }

  return (
    <ErrorBoundary fallback={null} onError={(error) => captureException(error)}>
      {part === 'calendar' ? <DemoCalendarTour /> : <DemoStatsTour />}
    </ErrorBoundary>
  );
}

const DemoCalendarTour = dynamic(() => import('@/demo/components/DemoCalendarTour'), {ssr: false});

const DemoStatsTour = dynamic(() => import('@/demo/components/DemoStatsTour'), {ssr: false});

function createVisibleSnapshot(part: DemoTourPart) {
  let visible: boolean | undefined;

  return () => {
    visible ??= !hasSeenDemoTour(part);
    return visible;
  };
}

function subscribeNothing() {
  return () => {};
}

function getServerVisible() {
  return false;
}
