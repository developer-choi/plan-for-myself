import {useSyncExternalStore} from 'react';
import {parseLoginNudgeDismissal, serializeLoginNudgeDismissal, shouldShowLoginNudge} from './login-nudge-date';

export interface LoginNudgeStore {
  subscribe: (onChange: () => void) => () => void;
  /** undefined: 저장값을 아직 읽지 못했다 */
  read: () => string | null | undefined;
  write: (dismissal: string) => void;
}

interface UseLoginNudgeResult {
  visible: boolean;
  dismiss: () => void;
}

export default function useLoginNudge(
  today: string,
  recordedDays: number,
  store: LoginNudgeStore,
): UseLoginNudgeResult {
  const stored = useSyncExternalStore(store.subscribe, store.read, readUnknown);
  const visible = stored !== undefined && shouldShowLoginNudge(parseLoginNudgeDismissal(stored), today, recordedDays);

  const dismiss = () => {
    store.write(serializeLoginNudgeDismissal({date: today, recordedDays}));
  };

  return {visible, dismiss};
}

/* 서버는 저장소를 모르므로 띄우지 않고, 클라이언트에서 다시 판정한다 */
function readUnknown(): undefined {
  return undefined;
}
