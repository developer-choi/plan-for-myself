import {describe, expect, it} from 'vitest';
import type {FailureTag} from '../study-record/type';
import {findSelectedFailure, toggleSelectedTag} from './selected-tag';

describe('toggleSelectedTag()', () => {
  describe('General cases', () => {
    it('고른 태그가 없을 때 태그 줄을 누르면 그 태그를 반환해야 한다', () => {
      expect(toggleSelectedTag(null, SNACK.tag)).toBe(SNACK.tag);
    });

    it('고른 태그와 같은 태그 줄을 누르면 null을 반환해야 한다', () => {
      expect(toggleSelectedTag(SNACK.tag, SNACK.tag)).toBeNull();
    });

    it('고른 태그와 다른 태그 줄을 누르면 누른 태그를 반환해야 한다', () => {
      expect(toggleSelectedTag(SNACK.tag, HEADACHE.tag)).toBe(HEADACHE.tag);
    });
  });
});

describe('findSelectedFailure()', () => {
  describe('General cases', () => {
    it('고른 태그가 목록에 있으면 그 태그 항목을 반환해야 한다', () => {
      expect(findSelectedFailure([SNACK, HEADACHE], HEADACHE.tag)).toBe(HEADACHE);
    });
  });

  describe('Edge cases', () => {
    it('고른 태그가 없으면 undefined를 반환해야 한다', () => {
      expect(findSelectedFailure([SNACK, HEADACHE], null)).toBeUndefined();
    });

    it('고른 태그가 목록에 없으면 undefined를 반환해야 한다', () => {
      expect(findSelectedFailure([HEADACHE], SNACK.tag)).toBeUndefined();
    });
  });
});

const SNACK: FailureTag = {
  tag: '야식',
  count: 3,
  previousCount: 1,
  status: 'repeated',
  trend: [{month: '2026-09', count: 3, previousCount: 1, status: 'repeated'}],
};
const HEADACHE: FailureTag = {
  tag: '두통',
  count: 2,
  previousCount: 0,
  status: 'appeared',
  trend: [{month: '2026-09', count: 2, previousCount: 0, status: 'repeated'}],
};
