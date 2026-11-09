import {describe, expect, it} from 'vitest';
import {formatMonthTitle, getCalendarCells, parseMonth, shiftMonth} from './calendar-month';

describe('shiftMonth()', () => {
  describe('General cases', () => {
    it('9월의 다음 달은 같은 해 10월을 반환해야 한다', () => {
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
    it('연·월 문자열이면 숫자 연·월을 반환해야 한다', () => {
      expect(parseMonth({year: '2026', month: '9'})).toEqual({year: 2026, month: 9});
    });
  });

  describe('Boundary cases', () => {
    it('가장 이른 해 1000년 1월이면 1000년 1월을 반환해야 한다', () => {
      expect(parseMonth({year: '1000', month: '1'})).toEqual({year: 1000, month: 1});
    });

    it('가장 늦은 해 9998년 12월이면 9998년 12월을 반환해야 한다', () => {
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
      {year: '9999', reason: '9998년보다 큰 네 자리 해'},
      {year: '10000', reason: '다섯 자리 해'},
      {year: '-2026', reason: '음수 해'},
    ].forEach(({year, reason}) => {
      it(`${reason}이면 null을 반환해야 한다`, () => {
        expect(parseMonth({year, month: '9'})).toBeNull();
      });
    });
  });
});

describe('formatMonthTitle()', () => {
  describe('General cases', () => {
    it('달을 넘기면 「YYYY년 M월」 제목을 반환해야 한다', () => {
      expect(formatMonthTitle({year: 2026, month: 10})).toBe('2026년 10월');
    });
  });
});

describe('getCalendarCells()', () => {
  const daysPerWeek = 7;

  describe('General cases', () => {
    it('첫 칸을 월요일 날짜로 반환해야 한다', () => {
      const monday = 1;
      const cells = getCalendarCells({year: 2026, month: 9});

      expect(new Date(`${cells[0]?.date ?? ''}T00:00:00`).getDay()).toBe(monday);
    });

    it('그 달이 걸친 주 수 × 7개의 칸을 반환해야 한다', () => {
      const weeks = 5;

      expect(getCalendarCells({year: 2026, month: 9})).toHaveLength(weeks * daysPerWeek);
    });

    it('앞 빈칸은 지난달 날짜를 이번 달 밖 칸으로 반환해야 한다', () => {
      const cells = getCalendarCells({year: 2026, month: 9});

      expect(cells[0]).toEqual({date: '2026-08-31', day: 31, inMonth: false});
    });

    it('뒤 빈칸은 다음 달 날짜를 이번 달 밖 칸으로 반환해야 한다', () => {
      const cells = getCalendarCells({year: 2026, month: 9});

      expect(cells.at(-1)).toEqual({date: '2026-10-04', day: 4, inMonth: false});
    });

    it('1일부터 말일까지는 이번 달 칸으로 반환해야 한다', () => {
      const cells = getCalendarCells({year: 2026, month: 9});

      const daysInSeptember = 30;
      const firstDayIndex = 1;
      const septemberCells = cells.slice(firstDayIndex, firstDayIndex + daysInSeptember);

      expect(septemberCells.every(({inMonth}) => inMonth)).toBe(true);
      expect(septemberCells.map(({day}) => day)).toEqual(
        Array.from({length: daysInSeptember}, (_day, index) => index + 1),
      );
    });
  });

  describe('Boundary cases', () => {
    it('1일이 월요일이면 첫 칸을 1일로 반환해야 한다', () => {
      const cells = getCalendarCells({year: 2026, month: 6});

      expect(cells[0]).toEqual({date: '2026-06-01', day: 1, inMonth: true});
    });

    it('1일이 일요일이면 1일 앞에 이번 달 밖 칸 6개를 반환해야 한다', () => {
      const leadingDays = 6;
      const cells = getCalendarCells({year: 2026, month: 2});

      expect(cells.slice(0, leadingDays).every(({inMonth}) => !inMonth)).toBe(true);
      expect(cells[leadingDays]).toEqual({date: '2026-02-01', day: 1, inMonth: true});
    });

    it('4주에 딱 맞는 2월이면 4주치 칸을 반환해야 한다', () => {
      const weeks = 4;

      expect(getCalendarCells({year: 2027, month: 2})).toHaveLength(weeks * daysPerWeek);
    });

    it('6주에 걸친 달이면 6주치 칸을 반환해야 한다', () => {
      const weeks = 6;

      expect(getCalendarCells({year: 2026, month: 3})).toHaveLength(weeks * daysPerWeek);
    });

    it('윤년 2월이면 29일을 이번 달 칸으로 반환해야 한다', () => {
      const cells = getCalendarCells({year: 2044, month: 2});

      expect(cells.find(({date}) => date === '2044-02-29')?.inMonth).toBe(true);
    });

    it('12월이면 뒤 빈칸을 다음 해 1월 날짜로 반환해야 한다', () => {
      const cells = getCalendarCells({year: 2026, month: 12});

      expect(cells.at(-1)).toEqual({date: '2027-01-03', day: 3, inMonth: false});
    });

    it('1월이면 앞 빈칸을 전해 12월 날짜로 반환해야 한다', () => {
      const cells = getCalendarCells({year: 2027, month: 1});

      expect(cells[0]).toEqual({date: '2026-12-28', day: 28, inMonth: false});
    });
  });
});
