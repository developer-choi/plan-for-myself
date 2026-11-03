import type {FailureTag, FailureTagStatus} from '../study-record/type';
import {formatMonthLabel} from './format';

export function filterByStatus(failureTags: FailureTag[], status: FailureTagStatus): FailureTag[] {
  return failureTags.filter((failureTag) => failureTag.status === status);
}

export function getFirstFailureTagName(failureTags: FailureTag[]): string | undefined {
  return FAILURE_TAG_GROUP_ORDER.map((status) => filterByStatus(failureTags, status)).find(
    (tags) => tags.length > 0,
  )?.[0]?.tag;
}

export function formatFailCardTitle(month: string): string {
  return `${formatMonthLabel(month)} 실패`;
}

export function formatFailEmptyTitle(month: string): string {
  return `${formatMonthLabel(month)}에 적은 실패가 없어요`;
}

export function formatReducedGroupTitle(inProgress: boolean): string {
  return inProgress ? '줄어들고 있어요' : '줄었어요';
}

export function formatRepeatedNotePrefix(previousCount: number, inProgress: boolean): string {
  return `지난달 ${previousCount}번 → ${inProgress ? '벌써 ' : ''}`;
}

export function formatAppearedNotePrefix(month: string, inProgress: boolean): string {
  return `${inProgress ? '이번 달' : formatMonthLabel(month)} 처음 · `;
}

export function formatReducedNotePrefix(previousCount: number): string {
  return `지난달 ${previousCount}번 → `;
}

const FAILURE_TAG_GROUP_ORDER: FailureTagStatus[] = ['repeated', 'appeared', 'reduced'];
