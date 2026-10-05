import {describe, expect, it} from 'vitest';
import {getCalendarCells, isSameMonth, parseMonth, shiftMonth, toMonthParam} from './calendar-date';

describe('getCalendarCells()', () => {
  const daysPerWeek = 7;

  describe('General cases', () => {
    it('첫 칸은 월요일이고 칸 수는 그 달이 걸친 주 수 × 7이어야 한다', () => {
      const monday = 1;
      const weeks = 5;
      const cells = getCalendarCells({year: 2026, month: 9});

      expect(new Date(`${cells[0].date}T00:00:00`).getDay()).toBe(monday);
      expect(cells).toHaveLength(weeks * daysPerWeek);
    });

    it('앞뒤 빈칸은 지난달·다음 달 날짜로 채우고 이번 달이 아니라고 표시해야 한다', () => {
      const cells = getCalendarCells({year: 2026, month: 9});

      expect(cells[0]).toEqual({date: '2026-08-31', day: 31, inMonth: false});
      expect(cells[1]).toEqual({date: '2026-09-01', day: 1, inMonth: true});
      expect(cells[30]).toEqual({date: '2026-09-30', day: 30, inMonth: true});
      expect(cells[34]).toEqual({date: '2026-10-04', day: 4, inMonth: false});
    });
  });

  describe('Boundary cases', () => {
    it('1일이 월요일이면 앞 빈칸 없이 1일부터 시작해야 한다', () => {
      const cells = getCalendarCells({year: 2026, month: 6});

      expect(cells[0]).toEqual({date: '2026-06-01', day: 1, inMonth: true});
    });

    it('1일이 일요일이면 앞에 6칸을 채워야 한다', () => {
      const leadingDays = 6;
      const cells = getCalendarCells({year: 2026, month: 2});

      expect(cells.slice(0, leadingDays).every(({inMonth}) => !inMonth)).toBe(true);
      expect(cells[leadingDays]).toEqual({date: '2026-02-01', day: 1, inMonth: true});
    });

    it('4주에 딱 맞는 2월은 4줄이어야 한다', () => {
      const weeks = 4;

      expect(getCalendarCells({year: 2027, month: 2})).toHaveLength(weeks * daysPerWeek);
    });

    it('6주에 걸친 달은 6줄이어야 한다', () => {
      const weeks = 6;

      expect(getCalendarCells({year: 2026, month: 3})).toHaveLength(weeks * daysPerWeek);
    });

    it('윤년 2월은 29일까지 이번 달 칸으로 채워야 한다', () => {
      const weeks = 5;
      const cells = getCalendarCells({year: 2044, month: 2});

      expect(cells).toHaveLength(weeks * daysPerWeek);
      expect(cells.find(({date}) => date === '2044-02-29')?.inMonth).toBe(true);
    });

    it('12월의 뒤 빈칸은 다음 해 1월 날짜로 채워야 한다', () => {
      const cells = getCalendarCells({year: 2026, month: 12});

      expect(cells.at(-1)).toEqual({date: '2027-01-03', day: 3, inMonth: false});
    });

    it('1월의 앞 빈칸은 전해 12월 날짜로 채워야 한다', () => {
      const cells = getCalendarCells({year: 2027, month: 1});

      expect(cells[0]).toEqual({date: '2026-12-28', day: 28, inMonth: false});
    });
  });
});

describe('isSameMonth()', () => {
  describe('General cases', () => {
    it('날짜의 연·월이 보고 있는 달과 같으면 true여야 한다', () => {
      expect(isSameMonth('2026-10-04', {year: 2026, month: 10})).toBe(true);
    });
  });

  describe('Edge cases', () => {
    it('달은 같아도 해가 다르면 false여야 한다', () => {
      expect(isSameMonth('2025-10-04', {year: 2026, month: 10})).toBe(false);
    });

    it('해는 같아도 달이 다르면 false여야 한다', () => {
      expect(isSameMonth('2026-09-30', {year: 2026, month: 10})).toBe(false);
    });
  });
});

describe('toMonthParam()', () => {
  describe('General cases', () => {
    it('한 자리 달도 두 자리로 채운 YYYY-MM을 반환해야 한다', () => {
      expect(toMonthParam({year: 2026, month: 9})).toBe('2026-09');
    });

    it('두 자리 달은 그대로 YYYY-MM을 반환해야 한다', () => {
      expect(toMonthParam({year: 2026, month: 10})).toBe('2026-10');
    });
  });
});

describe('shiftMonth()', () => {
  describe('General cases', () => {
    it('같은 해 안에서는 달만 바꿔 반환해야 한다', () => {
      expect(shiftMonth({year: 2026, month: 9}, 1)).toEqual({year: 2026, month: 10});
    });
  });

  describe('Boundary cases', () => {
    it('1월의 지난 달은 전해 12월을 반환해야 한다', () => {
      expect(shiftMonth({year: 2026, month: 1}, -1)).toEqual({year: 2025, month: 12});
    });

    it('12월의 다음 달은 다음 해 1월을 반환해야 한다', () => {
      expect(shiftMonth({year: 2025, month: 12}, 1)).toEqual({year: 2026, month: 1});
    });
  });
});

describe('parseMonth()', () => {
  describe('General cases', () => {
    it('주소의 연·월 문자열을 숫자 달로 읽어야 한다', () => {
      expect(parseMonth({year: '2026', month: '9'})).toEqual({year: 2026, month: 9});
    });
  });

  describe('Boundary cases', () => {
    it('기록 API가 받는 경계의 해와 1월·12월을 읽어야 한다', () => {
      expect(parseMonth({year: '1000', month: '1'})).toEqual({year: 1000, month: 1});
      expect(parseMonth({year: '9998', month: '12'})).toEqual({year: 9998, month: 12});
    });
  });

  describe('Edge cases', () => {
    [
      {month: '0', reason: '0월'},
      {month: '13', reason: '13월'},
      {month: 'abc', reason: '숫자가 아닌 달'},
      {month: '1.5', reason: '정수가 아닌 달'},
      {month: '09', reason: '앞에 0이 붙은 달'},
      {month: '1e1', reason: '지수 표기 달'},
    ].forEach(({month, reason}) => {
      it(`${reason}이면 null을 반환해야 한다`, () => {
        expect(parseMonth({year: '2026', month})).toBeNull();
      });
    });

    [
      {year: 'abc', reason: '숫자가 아닌 해'},
      {year: '50', reason: '두 자리 해'},
      {year: '0999', reason: '앞에 0이 붙은 해'},
      {year: '999', reason: '세 자리 해'},
      {year: '9999', reason: '기록 API 범위 밖인 해'},
      {year: '10000', reason: '다섯 자리 해'},
      {year: '-2026', reason: '음수 해'},
    ].forEach(({year, reason}) => {
      it(`${reason}이면 null을 반환해야 한다`, () => {
        expect(parseMonth({year, month: '9'})).toBeNull();
      });
    });
  });
});
