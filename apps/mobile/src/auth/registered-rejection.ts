import {useSyncExternalStore} from 'react';
import {type RegisteredAccountRejection, REGISTERED_REJECTION_TTL_SECONDS} from '@plan-for-myself/shared/auth';

interface StoredRejection {
  rejection: RegisteredAccountRejection;
  expiresAt: number;
}

export function saveRegisteredRejection(rejection: RegisteredAccountRejection): void {
  storedRejection = {rejection, expiresAt: Date.now() + REGISTERED_REJECTION_TTL_MILLISECONDS};
  notifyListeners();
}

export function clearRegisteredRejection(): void {
  storedRejection = null;
  notifyListeners();
}

/**
 * null: 거절이 없거나 유지 시간이 지났다
 */
export function readRegisteredRejection(): RegisteredAccountRejection | null {
  return pickActiveRejection(storedRejection, Date.now());
}

export function useRegisteredRejection(): RegisteredAccountRejection | null {
  return useSyncExternalStore(subscribe, readRegisteredRejection);
}

export function pickActiveRejection(stored: StoredRejection | null, now: number): RegisteredAccountRejection | null {
  if (stored === null || stored.expiresAt <= now) {
    return null;
  }

  return stored.rejection;
}

const MILLISECONDS_PER_SECOND = 1000;
const REGISTERED_REJECTION_TTL_MILLISECONDS = REGISTERED_REJECTION_TTL_SECONDS * MILLISECONDS_PER_SECOND;

const listeners = new Set<() => void>();

let storedRejection: StoredRejection | null = null;

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notifyListeners() {
  listeners.forEach((listener) => listener());
}
