import {describe, expect, it} from 'vitest';
import {countTagsByMonth, getTagCount, isReduced} from './tag-count';
import {createTestRecord} from './test-record';

describe('countTagsByMonth()', () => {
  describe('General cases', () => {
    it('달마다 태그별로 찍힌 날 수를 세야 한다', () => {
      const counts = countTagsByMonth([
        createTestRecord('2026-08-31', {failTags: ['늦잠']}),
        createTestRecord('2026-09-01', {failTags: ['늦잠', '폰']}),
        createTestRecord('2026-09-02', {failTags: ['늦잠']}),
        createTestRecord('2026-09-03'),
      ]);

      expect({
        august: getTagCount(counts, '2026-08', '늦잠'),
        septemberLate: getTagCount(counts, '2026-09', '늦잠'),
        septemberPhone: getTagCount(counts, '2026-09', '폰'),
      }).toEqual({august: 1, septemberLate: 2, septemberPhone: 1});
    });
  });
});

describe('getTagCount()', () => {
  describe('Edge cases', () => {
    it('기록이 없는 달이면 0이어야 한다', () => {
      const counts = countTagsByMonth([createTestRecord('2026-08-31', {failTags: ['늦잠']})]);

      expect(getTagCount(counts, '2026-07', '늦잠')).toBe(0);
    });
  });
});

describe('isReduced()', () => {
  describe('Boundary cases', () => {
    it('지난달과 횟수가 같으면 false를 반환해야 한다', () => {
      expect(isReduced(1, 1)).toBe(false);
    });

    it('이번 달 횟수가 0이면 true를 반환해야 한다', () => {
      expect(isReduced(0, 1)).toBe(true);
    });
  });
});
