import {z} from 'zod';

export const LOGIN_NUDGE_STORAGE_KEY = 'login-nudge-dismissed';

export type LoginNudgeDismissal = z.infer<typeof dismissalSchema>;

export function shouldShowLoginNudge(
  dismissal: LoginNudgeDismissal | null,
  today: string,
  recordedDays: number,
): boolean {
  if (recordedDays === 0) {
    return false;
  }

  if (!dismissal) {
    return true;
  }

  const elapsedDays = (Date.parse(today) - Date.parse(dismissal.date)) / MILLISECONDS_PER_DAY;
  return elapsedDays >= LOGIN_NUDGE_INTERVAL_DAYS && recordedDays > dismissal.recordedDays;
}

export function parseLoginNudgeDismissal(text: string | null): LoginNudgeDismissal | null {
  if (text === null) {
    return null;
  }

  try {
    const result = dismissalSchema.safeParse(JSON.parse(text));
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

export function serializeLoginNudgeDismissal(dismissal: LoginNudgeDismissal): string {
  return JSON.stringify(dismissal);
}

const LOGIN_NUDGE_INTERVAL_DAYS = 7;
const MILLISECONDS_PER_DAY = 86_400_000;

const dismissalSchema = z.object({
  date: z.iso.date({error: '닫은 날이 날짜가 아니에요'}),
  recordedDays: z
    .number({error: '닫을 때 기록한 날 수가 숫자가 아니에요'})
    .int({error: '닫을 때 기록한 날 수가 정수가 아니에요'})
    .nonnegative({error: '닫을 때 기록한 날 수가 음수예요'}),
});
