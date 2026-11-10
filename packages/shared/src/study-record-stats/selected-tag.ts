import type {FailureTag} from '../study-record/type';

export interface FailureTagSelection {
  /* 아무 태그도 고르지 않았으면 null */
  selectedTag: string | null;
  onSelect: (tag: string) => void;
}

export function toggleSelectedTag(selectedTag: string | null, pressedTag: string): string | null {
  return selectedTag === pressedTag ? null : pressedTag;
}

export function findSelectedFailure(failureTags: FailureTag[], selectedTag: string | null): FailureTag | undefined {
  return failureTags.find(({tag}) => tag === selectedTag);
}
