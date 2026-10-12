import {describe, expect, it} from 'vitest';
import {formatDuration, formatMinutesDiff, formatMonthLabel, formatStreakNote} from './format';

const HOUR = 60;

describe('formatDuration()', () => {
  describe('General cases', () => {
    it('시간과 분이 다 있으면 「N시간 M분」이어야 한다', () => {
      const twoHoursFortyFive = 165;

      expect(formatDuration(twoHoursFortyFive)).toBe('2시간 45분');
    });

    it('1시간이 안 되면 분만 적어야 한다', () => {
      const fortyFiveMinutes = 45;

      expect(formatDuration(fortyFiveMinutes)).toBe('45분');
    });

    it('분이 0이면 시간만 적어야 한다', () => {
      const threeHours = 180;

      expect(formatDuration(threeHours)).toBe('3시간');
    });
  });

  describe('Boundary cases', () => {
    const hundredHours = 6000;

    it('0분이면 「0분」이어야 한다', () => {
      expect(formatDuration(0)).toBe('0분');
    });

    it('100시간이 안 되면 분까지 적어야 한다', () => {
      expect(formatDuration(hundredHours - 1)).toBe('99시간 59분');
    });

    it('100시간부터는 분을 버려야 한다', () => {
      expect(formatDuration(hundredHours + HOUR - 1)).toBe('100시간');
    });

    it('천 시간부터 천 단위마다 쉼표를 넣어야 한다', () => {
      const thousandHours = 60000;

      expect(formatDuration(thousandHours)).toBe('1,000시간');
    });
  });
});

describe('formatMinutesDiff()', () => {
  describe('General cases', () => {
    it('지난달보다 늘었으면 늘어난 시간 앞에 더하기 부호를 붙여야 한다', () => {
      const increasedMinutes = 15;

      expect(formatMinutesDiff(increasedMinutes)).toBe('+15분');
    });

    it('지난달보다 줄었으면 줄어든 시간 앞에 빼기 부호를 붙여야 한다', () => {
      const decreasedMinutes = 70;

      expect(formatMinutesDiff(-decreasedMinutes)).toBe('−1시간 10분');
    });
  });

  describe('Boundary cases', () => {
    it('지난달과 같으면 더하기 부호를 붙여야 한다', () => {
      expect(formatMinutesDiff(0)).toBe('+0분');
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
