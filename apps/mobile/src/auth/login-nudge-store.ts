import AsyncStorage from '@react-native-async-storage/async-storage';
import {captureException} from '@sentry/react-native';
import {LOGIN_NUDGE_STORAGE_KEY} from '@plan-for-myself/shared/auth';
import type {LoginNudgeStore} from '@plan-for-myself/shared/auth/react';

export const appLoginNudgeStore: LoginNudgeStore = {
  subscribe,
  read,
  write,
};

const listeners = new Set<() => void>();

let storedDismissal: string | null | undefined = undefined;
let isLoadStarted = false;

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  loadOnce().catch(captureException);
  return () => {
    listeners.delete(onChange);
  };
}

function read(): string | null | undefined {
  return storedDismissal;
}

function write(dismissal: string): void {
  storedDismissal = dismissal;
  notifyListeners();
  AsyncStorage.setItem(LOGIN_NUDGE_STORAGE_KEY, dismissal).catch(captureException);
}

async function loadOnce() {
  if (isLoadStarted) {
    return;
  }

  isLoadStarted = true;
  const stored = await AsyncStorage.getItem(LOGIN_NUDGE_STORAGE_KEY).catch(reportReadFailure);
  storedDismissal = stored;
  notifyListeners();
}

function reportReadFailure(error: unknown) {
  captureException(error);
  return null;
}

function notifyListeners() {
  listeners.forEach((listener) => listener());
}
