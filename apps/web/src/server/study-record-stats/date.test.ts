import {describe, expect, it} from 'vitest';
import {addDays, addMonths, getDayOfMonth, getDaysInMonth, listMonths, toMonth} from './date';

describe('addDays()', () => {
  describe('Boundary cases', () => {
    it('월말에 하루를 더하면 다음 달 1일이 되어야 한다', () => {
      expect(addDays('2026-09-30', 1)).toBe('2026-10-01');
    });

    it('연초에서 하루를 빼면 전년 12월 31일이 되어야 한다', () => {
      expect(addDays('2026-01-01', -1)).toBe('2025-12-31');
    });
  });
});

describe('addMonths()', () => {
  describe('Boundary cases', () => {
    it('12월에 한 달을 더하면 다음 해 1월이 되어야 한다', () => {
      expect(addMonths('2026-12', 1)).toBe('2027-01');
    });

    it('1월에서 한 달을 빼면 전년 12월이 되어야 한다', () => {
      expect(addMonths('2026-01', -1)).toBe('2025-12');
    });
  });
});

describe('listMonths()', () => {
  describe('Boundary cases', () => {
    it('시작 달부터 끝 달까지 양끝을 포함해 반환해야 한다', () => {
      expect(listMonths('2026-11', '2027-01')).toEqual(['2026-11', '2026-12', '2027-01']);
    });
  });

  describe('Edge cases', () => {
    it('시작 달이 끝 달보다 뒤면 빈 목록을 반환해야 한다', () => {
      expect(listMonths('2026-10', '2026-09')).toEqual([]);
    });
  });
});

describe('toMonth()', () => {
  describe('General cases', () => {
    it('날짜에서 연·월만 반환해야 한다', () => {
      expect(toMonth('2026-09-24')).toBe('2026-09');
    });
  });
});

describe('getDaysInMonth()', () => {
  describe('General cases', () => {
    [
      {name: '2026년 9월', month: '2026-09', days: 30},
      {name: '2026년 10월', month: '2026-10', days: 31},
      {name: '2026년 2월', month: '2026-02', days: 28},
    ].forEach(({name, month, days}) => {
      it(`${name}은 ${days}일이어야 한다`, () => {
        expect(getDaysInMonth(month)).toBe(days);
      });
    });
  });

  describe('Boundary cases', () => {
    [
      {name: '윤년 2월', month: '2028-02', days: 29},
      {name: '해가 넘어가는 12월', month: '2026-12', days: 31},
    ].forEach(({name, month, days}) => {
      it(`${name}은 ${days}일이어야 한다`, () => {
        expect(getDaysInMonth(month)).toBe(days);
      });
    });
  });
});

describe('getDayOfMonth()', () => {
  describe('General cases', () => {
    it('날짜에서 일만 숫자로 반환해야 한다', () => {
      const day = 4;
      expect(getDayOfMonth('2026-09-04')).toBe(day);
    });
  });
});
