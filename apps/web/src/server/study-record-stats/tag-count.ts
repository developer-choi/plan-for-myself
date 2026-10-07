import type {StudyRecord} from '@plan-for-myself/shared';
import {toMonth} from './date';

/* 달 → 태그 → 그 달 그 태그가 찍힌 날 수. 기록은 하루 한 줄이라 태그가 나온 기록 수가 곧 날 수다 */
export type TagCountByMonth = Map<string, Map<string, number>>;

export function countTagsByMonth(records: StudyRecord[]): TagCountByMonth {
  const counts: TagCountByMonth = new Map();

  for (const record of records) {
    const month = toMonth(record.date);
    const tagCounts = counts.get(month) ?? new Map<string, number>();

    for (const tag of record.failTags) {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
    }
    counts.set(month, tagCounts);
  }

  return counts;
}

export function getTagCount(counts: TagCountByMonth, month: string, tag: string) {
  return counts.get(month)?.get(tag) ?? 0;
}

export function isReduced(count: number, previousCount: number) {
  return count < previousCount;
}
