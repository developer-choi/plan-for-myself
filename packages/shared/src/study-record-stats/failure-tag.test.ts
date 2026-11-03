import {describe, expect, it} from 'vitest';
import {
  formatAppearedNotePrefix,
  formatReducedGroupTitle,
  formatRepeatedNotePrefix,
  getFirstFailureTagName,
} from './failure-tag';
import type {FailureTag, FailureTagStatus} from '../study-record/type';

describe('formatReducedGroupTitle()', () => {
  describe('General cases', () => {
    it('진행 중인 달이면 아직 줄어드는 중이라는 제목을 반환해야 한다', () => {
      expect(formatReducedGroupTitle(true)).toBe('줄어들고 있어요');
    });

    it('끝난 달이면 이미 줄었다는 제목을 반환해야 한다', () => {
      expect(formatReducedGroupTitle(false)).toBe('줄었어요');
    });
  });
});

describe('formatRepeatedNotePrefix()', () => {
  describe('General cases', () => {
    it('진행 중인 달이면 지난달 횟수 뒤에 「벌써」를 붙인 문구를 반환해야 한다', () => {
      expect(formatRepeatedNotePrefix(2, true)).toBe('지난달 2번 → 벌써 ');
    });

    it('끝난 달이면 「벌써」 없이 지난달 횟수만 적은 문구를 반환해야 한다', () => {
      expect(formatRepeatedNotePrefix(2, false)).toBe('지난달 2번 → ');
    });
  });
});

describe('formatAppearedNotePrefix()', () => {
  describe('General cases', () => {
    it('진행 중인 달이면 달 이름 대신 「이번 달 처음」으로 시작하는 문구를 반환해야 한다', () => {
      expect(formatAppearedNotePrefix('2026-09', true)).toBe('이번 달 처음 · ');
    });

    it('끝난 달이면 그 달 이름을 넣은 「n월 처음」 문구를 반환해야 한다', () => {
      expect(formatAppearedNotePrefix('2026-09', false)).toBe('9월 처음 · ');
    });
  });
});

describe('getFirstFailureTagName()', () => {
  describe('General cases', () => {
    it('줄어든 태그가 배열 앞에 있어도 반복된 태그 이름을 반환해야 한다', () => {
      const failureTags = [
        createFailureTag('야식', 'reduced'),
        createFailureTag('게임', 'appeared'),
        createFailureTag('늦잠', 'repeated'),
      ];

      expect(getFirstFailureTagName(failureTags)).toBe('늦잠');
    });

    it('반복된 태그가 없으면 새로 생긴 태그 이름을 반환해야 한다', () => {
      const failureTags = [createFailureTag('야식', 'reduced'), createFailureTag('게임', 'appeared')];

      expect(getFirstFailureTagName(failureTags)).toBe('게임');
    });
  });

  describe('Edge cases', () => {
    it('실패 태그가 없으면 undefined를 반환해야 한다', () => {
      expect(getFirstFailureTagName([])).toBeUndefined();
    });
  });
});

function createFailureTag(tag: string, status: FailureTagStatus): FailureTag {
  return {tag, status, count: 1, previousCount: 1, trend: []};
}
