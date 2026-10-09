import {FAILURE_TAG_TREND_MONTH_LIMIT, type FailureTagTrend} from '@plan-for-myself/shared';
import {addMonths, listMonths} from './date';
import {getTagCount, isReduced, type TagCountByMonth} from './tag-count';

export function listTrend(counts: TagCountByMonth, month: string, tag: string): FailureTagTrend[] {
  const firstMonth = findFirstMonth(counts, tag);
  if (firstMonth === undefined) {
    return [];
  }

  const recentStart = addMonths(month, -(FAILURE_TAG_TREND_MONTH_LIMIT - 1));
  const from = firstMonth > recentStart ? firstMonth : recentStart;

  return listMonths(from, month).map((trendMonth) => {
    const count = getTagCount(counts, trendMonth, tag);
    const previousCount = getTagCount(counts, addMonths(trendMonth, -1), tag);

    return {month: trendMonth, count, previousCount, status: isReduced(count, previousCount) ? 'reduced' : 'repeated'};
  });
}

function findFirstMonth(counts: TagCountByMonth, tag: string) {
  return [...counts.keys()]
    .filter((countMonth) => getTagCount(counts, countMonth, tag) > 0)
    .sort()
    .at(0);
}
