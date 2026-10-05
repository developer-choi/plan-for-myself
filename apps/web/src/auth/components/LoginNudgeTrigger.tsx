'use client';

import {useEffect, useState, useSyncExternalStore} from 'react';
import dynamic from 'next/dynamic';
import {ErrorBoundary} from 'react-error-boundary';
import {getKoreanToday} from '@plan-for-myself/shared';
import {LOGIN_NUDGE_STORAGE_KEY, shouldShowLoginNudge} from '@/auth/login-nudge-date';

interface LoginNudgeTriggerProps {
  targetId: string;
}

export default function LoginNudgeTrigger({targetId}: LoginNudgeTriggerProps) {
  const [getVisible] = useState(createVisibleSnapshot);
  const visible = useSyncExternalStore(subscribeNothing, getVisible, getServerVisible);

  useEffect(() => {
    if (visible) {
      writeLastShownDate(getKoreanToday());
    }
  }, [visible]);

  if (!visible) {
    return null;
  }

  return (
    <ErrorBoundary fallback={null}>
      <LoginNudgeTour targetId={targetId} />
    </ErrorBoundary>
  );
}

const LoginNudgeTour = dynamic(() => import('@/auth/components/LoginNudgeTour'), {ssr: false});

/* 띄운 날을 저장한 뒤 다시 읽으면 판정이 거짓이 되어 말풍선이 사라지므로, 마운트마다 한 번만 판정해 둔다 */
function createVisibleSnapshot() {
  let visible: boolean | undefined;

  return () => {
    visible ??= shouldShowLoginNudge(readLastShownDate(), getKoreanToday());
    return visible;
  };
}

function subscribeNothing() {
  return () => {};
}

function getServerVisible() {
  return false;
}

function readLastShownDate(): string | null {
  try {
    return localStorage.getItem(LOGIN_NUDGE_STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeLastShownDate(today: string) {
  try {
    localStorage.setItem(LOGIN_NUDGE_STORAGE_KEY, today);
  } catch {
    return;
  }
}
