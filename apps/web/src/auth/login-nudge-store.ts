import {LOGIN_NUDGE_STORAGE_KEY, type LoginNudgeStore} from '@plan-for-myself/shared/auth';

export const webLoginNudgeStore: LoginNudgeStore = {
  subscribe,
  read,
  write,
};

const DISMISS_EVENT = 'login-nudge-dismiss';

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

function read(): string | null {
  try {
    return localStorage.getItem(LOGIN_NUDGE_STORAGE_KEY);
  } catch {
    return dismissedInMemory;
  }
}

function write(dismissal: string) {
  try {
    localStorage.setItem(LOGIN_NUDGE_STORAGE_KEY, dismissal);
  } catch {
    dismissedInMemory = dismissal;
  }
  window.dispatchEvent(new Event(DISMISS_EVENT));
}
