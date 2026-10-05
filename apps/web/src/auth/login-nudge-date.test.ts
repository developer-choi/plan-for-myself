import {describe, expect, it} from 'vitest';
import {shouldShowLoginNudge} from './login-nudge-date';

const today = '2026-10-05';

describe('shouldShowLoginNudge()', () => {
  it('한 번도 띄운 적이 없으면 띄운다', () => {
    expect(shouldShowLoginNudge(null, today)).toBe(true);
  });

  it('마지막으로 띄운 날이 7일 전이면 다시 띄운다', () => {
    expect(shouldShowLoginNudge('2026-09-28', today)).toBe(true);
  });

  it('마지막으로 띄운 날이 6일 전이면 띄우지 않는다', () => {
    expect(shouldShowLoginNudge('2026-09-29', today)).toBe(false);
  });

  it('오늘 띄웠으면 띄우지 않는다', () => {
    expect(shouldShowLoginNudge(today, today)).toBe(false);
  });

  ['yesterday', '2026-13-40', '2026-10', ''].forEach((lastShownDate) => {
    it(`저장된 값이 날짜가 아니면 처음처럼 띄운다 (${lastShownDate || '빈 문자열'})`, () => {
      expect(shouldShowLoginNudge(lastShownDate, today)).toBe(true);
    });
  });
});
