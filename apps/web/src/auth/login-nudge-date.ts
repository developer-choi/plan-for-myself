export const LOGIN_NUDGE_STORAGE_KEY = 'login-nudge-last-shown';

export function shouldShowLoginNudge(lastShownDate: string | null, today: string): boolean {
  const lastShownTime = lastShownDate !== null && DATE_PATTERN.test(lastShownDate) ? Date.parse(lastShownDate) : NaN;

  if (Number.isNaN(lastShownTime)) {
    return true;
  }

  const elapsedDays = (Date.parse(today) - lastShownTime) / MILLISECONDS_PER_DAY;
  return elapsedDays >= LOGIN_NUDGE_INTERVAL_DAYS;
}

const LOGIN_NUDGE_INTERVAL_DAYS = 7;
const MILLISECONDS_PER_DAY = 86_400_000;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
