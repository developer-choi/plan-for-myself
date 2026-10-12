'use client';

import {useSyncExternalStore} from 'react';
import {
  LOGIN_NUDGE_STORAGE_KEY,
  parseLoginNudgeDismissal,
  serializeLoginNudgeDismissal,
  shouldShowLoginNudge,
} from '@/auth/login-nudge-date';

interface UseLoginNudgeResult {
  visible: boolean;
  dismiss: () => void;
}

export function useLoginNudge(today: string, recordedDays: number): UseLoginNudgeResult {
  const stored = useSyncExternalStore<StoredDismissal>(subscribe, readStored, readServerStored);
  const visible =
    stored !== SERVER_UNKNOWN && shouldShowLoginNudge(parseLoginNudgeDismissal(stored), today, recordedDays);

  const dismiss = () => {
    const dismissal = serializeLoginNudgeDismissal({date: today, recordedDays});
    try {
      localStorage.setItem(LOGIN_NUDGE_STORAGE_KEY, dismissal);
    } catch {
      dismissedInMemory = dismissal;
    }
    window.dispatchEvent(new Event(DISMISS_EVENT));
  };

  return {visible, dismiss};
}

/* 서버는 저장소를 모르므로 띄우지 않고, 클라이언트에서 다시 판정한다 */
const SERVER_UNKNOWN = Symbol('server');
const DISMISS_EVENT = 'login-nudge-dismiss';

type StoredDismissal = string | null | typeof SERVER_UNKNOWN;

/* 저장소를 못 쓰는 브라우저는 닫기를 기억하지 못하므로, 이번 화면 안에서만 닫힌 것으로 둔다 */
let dismissedInMemory: string | null = null;

/* 다른 탭에서 닫은 것(storage)과 이 탭에서 닫은 것(DISMISS_EVENT)을 함께 받는다 */
function subscribe(onChange: () => void) {
  window.addEventListener('storage', onChange);
  window.addEventListener(DISMISS_EVENT, onChange);
  return () => {
    window.removeEventListener('storage', onChange);
    window.removeEventListener(DISMISS_EVENT, onChange);
  };
}

function readStored(): string | null {
  try {
    return localStorage.getItem(LOGIN_NUDGE_STORAGE_KEY);
  } catch {
    return dismissedInMemory;
  }
}

function readServerStored(): typeof SERVER_UNKNOWN {
  return SERVER_UNKNOWN;
}
