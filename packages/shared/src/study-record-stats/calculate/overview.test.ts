import {describe, expect, it} from 'vitest';
import {calculateOverview} from './overview';
import {createTestRecord} from './test-record';

const TODAY = '2026-09-24';

describe('calculateOverview()', () => {
  describe('연속 기록', () => {
    describe('General cases', () => {
      const brokenRecords = ['2026-09-01', '2026-09-02', '2026-09-03', '2026-09-04', '2026-09-22', '2026-09-23'].map(
        (date) => createTestRecord(date),
      );

      it('오늘을 아직 기록하지 않았으면 어제까지 이어진 일수여야 한다', () => {
        const records = ['2026-09-21', '2026-09-22', '2026-09-23'].map((date) => createTestRecord(date));

        expect(calculateOverview(records, TODAY).streak).toMatchObject({current: 3});
      });

      it('오늘을 기록했으면 오늘까지 이어진 일수여야 한다', () => {
        const records = ['2026-09-22', '2026-09-23', TODAY].map((date) => createTestRecord(date));

        expect(calculateOverview(records, TODAY).streak).toMatchObject({current: 3});
      });

      it('실패 태그가 있는 날도 기록한 날로 세야 한다', () => {
        const records = [
          createTestRecord('2026-09-22', {failTags: ['늦잠']}),
          createTestRecord('2026-09-23', {failTags: ['늦잠']}),
        ];

        expect(calculateOverview(records, TODAY).streak).toMatchObject({current: 2});
      });

      it('기록이 빠진 날이 있으면 그다음 날부터 다시 세야 한다', () => {
        expect(calculateOverview(brokenRecords, TODAY).streak).toMatchObject({current: 2});
      });

      it('끊기기 전 구간이 더 길면 최장 연속 기록은 그 길이여야 한다', () => {
        expect(calculateOverview(brokenRecords, TODAY).streak).toMatchObject({longest: 4});
      });

      it('지금 이어지는 구간이 가장 길면 최장 연속 기록도 그 길이여야 한다', () => {
        const records = ['2026-09-21', '2026-09-22', '2026-09-23'].map((date) => createTestRecord(date));

        expect(calculateOverview(records, TODAY).streak).toMatchObject({longest: 3});
      });
    });

    describe('Boundary cases', () => {
      it('어제와 오늘 모두 기록이 없으면 0이어야 한다', () => {
        const records = [createTestRecord('2026-09-20')];

        expect(calculateOverview(records, TODAY).streak).toMatchObject({current: 0});
      });

      it('어제 기록이 없어도 오늘을 기록했으면 1이어야 한다', () => {
        const records = [createTestRecord('2026-09-20'), createTestRecord(TODAY)];

        expect(calculateOverview(records, TODAY).streak).toMatchObject({current: 1});
      });
    });
  });

  describe('누적', () => {
    describe('General cases', () => {
      it('기록한 날 수, 공부시간 합, 첫 기록일을 반환해야 한다', () => {
        const records = [
          createTestRecord('2026-09-23', {minutes: {morning: 60, afternoon: 30}}),
          createTestRecord('2026-08-02', {minutes: {morning: 10, evening: 20}}),
        ];

        expect(calculateOverview(records, TODAY)).toMatchObject({
          date: TODAY,
          firstRecordDate: '2026-08-02',
          totals: {recordedDays: 2, studiedMinutes: 120},
        });
      });
    });
  });

  describe('Edge cases', () => {
    it('넘긴 날짜보다 뒤의 기록은 최장 연속 기록과 누적에 넣지 않아야 한다', () => {
      const records = [
        createTestRecord('2026-09-23', {minutes: {morning: 30}}),
        createTestRecord('2026-09-25', {minutes: {morning: 60}}),
        createTestRecord('2026-09-26', {minutes: {morning: 60}}),
      ];

      expect(calculateOverview(records, TODAY)).toMatchObject({
        streak: {longest: 1},
        totals: {recordedDays: 1, studiedMinutes: 30},
      });
    });

    it('넘긴 날짜까지 기록이 없으면 뒤에 기록이 있어도 첫 기록일은 없어야 한다', () => {
      const records = [createTestRecord('2026-09-25')];

      expect(calculateOverview(records, TODAY).firstRecordDate).toBeNull();
    });

    it('기록이 하나도 없으면 첫 기록일은 없고 모든 수치가 0이어야 한다', () => {
      expect(calculateOverview([], TODAY)).toEqual({
        date: TODAY,
        firstRecordDate: null,
        streak: {current: 0, longest: 0},
        totals: {recordedDays: 0, studiedMinutes: 0},
      });
    });
  });
});
