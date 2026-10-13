export type DemoTourPart = 'calendar' | 'stats';

export const DEMO_TOUR_SEEN_STORAGE_KEYS: Record<DemoTourPart, string> = {
  calendar: 'demo-tour-seen-calendar',
  stats: 'demo-tour-seen-stats',
};

export function hasSeenDemoTour(part: DemoTourPart): boolean {
  try {
    return sessionStorage.getItem(DEMO_TOUR_SEEN_STORAGE_KEYS[part]) !== null;
  } catch {
    return false;
  }
}

export function markDemoTourSeen(part: DemoTourPart) {
  try {
    sessionStorage.setItem(DEMO_TOUR_SEEN_STORAGE_KEYS[part], 'true');
  } catch {
    return;
  }
}
