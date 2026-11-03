import type {DemoTourPart} from '@plan-for-myself/shared';

export function hasSeenDemoTour(part: DemoTourPart): boolean {
  return seenParts.has(part);
}

export function markDemoTourSeen(part: DemoTourPart): void {
  seenParts.add(part);
}

const seenParts = new Set<DemoTourPart>();
