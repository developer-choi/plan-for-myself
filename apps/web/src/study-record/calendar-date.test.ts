import {describe, expect, it} from 'vitest';
import {formatDateTitle, getCalendarCells, isSameMonth, toMonthParam} from './calendar-date';

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

describe('formatDateTitle()', () => {
  describe('General cases', () => {
    it('날짜를 넘기면 월·일·요일 제목을 반환해야 한다', () => {
      expect(formatDateTitle('2026-10-07')).toBe('10월 7일 (수)');
    });
  });

  describe('Boundary cases', () => {
    it('한 자리 월·일이면 앞의 0을 뗀 제목을 반환해야 한다', () => {
      expect(formatDateTitle('2026-01-05')).toBe('1월 5일 (월)');
    });

    it('일요일이면 요일 자리에 「일」을 반환해야 한다', () => {
      expect(formatDateTitle('2026-10-11')).toBe('10월 11일 (일)');
    });
  });
});
