import {describe, expect, it} from 'vitest';
import {parseLoginNudgeDismissal, serializeLoginNudgeDismissal, shouldShowLoginNudge} from './login-nudge-date';

const today = '2026-10-05';
const RECORDED_DAYS = 3;
const MORE_RECORDED_DAYS = RECORDED_DAYS + 1;

describe('shouldShowLoginNudge()', () => {
  describe('General cases', () => {
    describe('닫은 적이 없을 때', () => {
      it('기록이 없으면 false를 반환해야 한다', () => {
        expect(shouldShowLoginNudge(null, today, 0)).toBe(false);
      });

      it('첫 기록을 저장했으면 true를 반환해야 한다', () => {
        expect(shouldShowLoginNudge(null, today, 1)).toBe(true);
      });
    });

    describe('닫은 지 7일이 지났을 때', () => {
      it('그사이 기록이 늘지 않았으면 false를 반환해야 한다', () => {
        expect(shouldShowLoginNudge({date: '2026-09-28', recordedDays: RECORDED_DAYS}, today, RECORDED_DAYS)).toBe(
          false,
        );
      });

      it('그사이 기록이 늘었으면 true를 반환해야 한다', () => {
        expect(shouldShowLoginNudge({date: '2026-09-28', recordedDays: RECORDED_DAYS}, today, MORE_RECORDED_DAYS)).toBe(
          true,
        );
      });
    });
  });

  describe('Boundary cases', () => {
    describe('닫은 지 6일이면', () => {
      it('기록이 늘었어도 false를 반환해야 한다', () => {
        expect(shouldShowLoginNudge({date: '2026-09-29', recordedDays: RECORDED_DAYS}, today, MORE_RECORDED_DAYS)).toBe(
          false,
        );
      });
    });

    it('오늘 닫았으면 false를 반환해야 한다', () => {
      expect(shouldShowLoginNudge({date: today, recordedDays: RECORDED_DAYS}, today, MORE_RECORDED_DAYS)).toBe(false);
    });
  });
});

describe('parseLoginNudgeDismissal()', () => {
  describe('General cases', () => {
    it('저장한 값을 넘기면 저장하기 전 값을 반환해야 한다', () => {
      const dismissal = {date: today, recordedDays: RECORDED_DAYS};

      expect(parseLoginNudgeDismissal(serializeLoginNudgeDismissal(dismissal))).toEqual(dismissal);
    });
  });

  describe('Edge cases', () => {
    [
      {condition: '저장된 값이 없으면', text: null},
      {condition: '빈 문자열이면', text: ''},
      {condition: '날짜가 아닌 문자열이면', text: 'yesterday'},
      {condition: '없는 날짜면', text: '{"date":"2026-13-40","recordedDays":1}'},
      {condition: '기록 일수가 없는 값이면', text: '{"date":"2026-10-05"}'},
    ].forEach(({condition, text}) => {
      it(`${condition} null을 반환해야 한다`, () => {
        expect(parseLoginNudgeDismissal(text)).toBeNull();
      });
    });
  });
});
