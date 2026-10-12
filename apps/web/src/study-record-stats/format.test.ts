import {describe, expect, it} from 'vitest';
import {
  formatHours,
  formatMinutesDiff,
  formatMonthLabel,
  formatStreakNote,
  minutesToHours,
} from './format';

describe('formatMinutesDiff()', () => {
  describe('General cases', () => {
    it('지난달보다 늘었으면 늘어난 시간 앞에 더하기 부호를 붙여야 한다', () => {
      const increasedMinutes = 13;

      expect(formatMinutesDiff(increasedMinutes)).toBe('+0:13');
    });

    it('지난달보다 줄었으면 줄어든 시간 앞에 빼기 부호를 붙여야 한다', () => {
      const decreasedMinutes = 32;

      expect(formatMinutesDiff(-decreasedMinutes)).toBe('−0:32');
    });
  });

  describe('Boundary cases', () => {
    it('지난달과 같으면 더하기 부호를 붙여야 한다', () => {
      expect(formatMinutesDiff(0)).toBe('+0:00');
    });

    it('차이가 60분을 넘으면 넘은 만큼 시간 자리로 올려 적어야 한다', () => {
      const minutes = 75;

      expect(formatMinutesDiff(minutes)).toBe('+1:15');
      expect(formatMinutesDiff(-minutes)).toBe('−1:15');
    });
  });
});

describe('minutesToHours()', () => {
  describe('Boundary cases', () => {
    const hourInMinutes = 60;

    [0, hourInMinutes - 1].forEach((minutes) => {
      it(`60분이 안 되면 0시간이어야 한다 (${minutes}분)`, () => {
        expect(minutesToHours(minutes)).toBe(0);
      });
    });

    it('60분이면 1시간이어야 한다', () => {
      expect(minutesToHours(hourInMinutes)).toBe(1);
    });

    it('60분을 넘긴 나머지 분은 버려야 한다', () => {
      const almostTwoHours = hourInMinutes * 2 - 1;

      expect(minutesToHours(almostTwoHours)).toBe(1);
    });
  });
});

describe('formatHours()', () => {
  describe('Boundary cases', () => {
    it('천 시간부터 천 단위마다 쉼표를 넣어야 한다', () => {
      const thousandHoursInMinutes = 60000;

      expect(formatHours(thousandHoursInMinutes)).toBe('1,000');
    });
  });
});

describe('formatStreakNote()', () => {
  describe('General cases', () => {
    it('연속 기록이 역대 최장에 못 미치면 역대 최장 기록을 보여줘야 한다', () => {
      expect(formatStreakNote({current: 14, longest: 49})).toBe('역대 최장 49일');
    });
  });

  describe('Boundary cases', () => {
    describe('연속 기록이 역대 최장과 같을 때', () => {
      it('연속 1일이면 역대 최장 기록을 보여줘야 한다', () => {
        expect(formatStreakNote({current: 1, longest: 1})).toBe('역대 최장 1일');
      });

      it('연속 2일부터 기록 경신 중임을 알려줘야 한다', () => {
        expect(formatStreakNote({current: 2, longest: 2})).toBe('최고 기록 경신 중');
      });
    });
  });
});

describe('formatMonthLabel()', () => {
  describe('General cases', () => {
    it('한 자리 달은 앞의 0을 빼고 적어야 한다', () => {
      expect(formatMonthLabel('2026-09')).toBe('9월');
    });

    it('두 자리 달은 숫자를 그대로 적어야 한다', () => {
      expect(formatMonthLabel('2026-12')).toBe('12월');
    });
  });
});
