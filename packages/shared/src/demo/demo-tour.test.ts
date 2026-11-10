import {describe, expect, it} from 'vitest';
import type {FailureTag} from '../study-record/type';
import {shouldShowDemoStatsTour} from './demo-tour';

describe('shouldShowDemoStatsTour()', () => {
  describe('General cases', () => {
    it('실패 태그가 있으면 true를 반환해야 한다', () => {
      const failureTag: FailureTag = {tag: '늦잠', status: 'repeated', count: 1, previousCount: 1, trend: []};

      expect(shouldShowDemoStatsTour({failureTags: [failureTag]})).toBe(true);
    });
  });

  describe('Edge cases', () => {
    it('실패 태그가 없으면 false를 반환해야 한다', () => {
      expect(shouldShowDemoStatsTour({failureTags: []})).toBe(false);
    });
  });
});
