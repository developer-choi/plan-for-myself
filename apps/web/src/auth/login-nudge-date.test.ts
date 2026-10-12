import {describe, expect, it} from 'vitest';
import {parseLoginNudgeDismissal, serializeLoginNudgeDismissal, shouldShowLoginNudge} from './login-nudge-date';

const today = '2026-10-05';
const RECORDED_DAYS = 3;
const MORE_RECORDED_DAYS = RECORDED_DAYS + 1;

describe('shouldShowLoginNudge()', () => {
  describe('General cases', () => {
    it('기록이 없으면 띄우지 않는다', () => {
      expect(shouldShowLoginNudge(null, today, 0)).toBe(false);
    });

    it('첫 기록을 저장한 뒤 닫은 적이 없으면 띄운다', () => {
      expect(shouldShowLoginNudge(null, today, 1)).toBe(true);
    });

    it('닫은 지 7일이 지났어도 그사이 기록이 늘지 않았으면 띄우지 않는다', () => {
      expect(shouldShowLoginNudge({date: '2026-09-28', recordedDays: RECORDED_DAYS}, today, RECORDED_DAYS)).toBe(false);
    });

    it('닫은 지 7일이 지나고 그사이 기록이 늘었으면 다시 띄운다', () => {
      expect(shouldShowLoginNudge({date: '2026-09-28', recordedDays: RECORDED_DAYS}, today, MORE_RECORDED_DAYS)).toBe(
        true,
      );
    });
  });

  describe('Boundary cases', () => {
    it('닫은 지 6일이면 기록이 늘었어도 띄우지 않는다', () => {
      expect(shouldShowLoginNudge({date: '2026-09-29', recordedDays: RECORDED_DAYS}, today, MORE_RECORDED_DAYS)).toBe(
        false,
      );
    });

    it('오늘 닫았으면 띄우지 않는다', () => {
      expect(shouldShowLoginNudge({date: today, recordedDays: RECORDED_DAYS}, today, MORE_RECORDED_DAYS)).toBe(false);
    });
  });
});

describe('parseLoginNudgeDismissal()', () => {
  it('저장한 값을 그대로 읽는다', () => {
    const dismissal = {date: today, recordedDays: RECORDED_DAYS};

    expect(parseLoginNudgeDismissal(serializeLoginNudgeDismissal(dismissal))).toEqual(dismissal);
  });

  [null, '', 'yesterday', '{"date":"2026-13-40","recordedDays":1}', '{"date":"2026-10-05"}'].forEach((text) => {
    it(`저장된 값이 없거나 깨졌으면 닫은 적이 없는 것으로 본다 (${text === null ? 'null' : text || '빈 문자열'})`, () => {
      expect(parseLoginNudgeDismissal(text)).toBeNull();
    });
  });
});
