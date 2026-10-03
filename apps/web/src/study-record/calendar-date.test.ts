import {describe, expect, it} from 'vitest';
import {parseMonth, shiftMonth} from './calendar-date';

describe('shiftMonth', () => {
  it('1월의 지난 달은 전해 12월이다', () => {
    expect(shiftMonth({year: 2026, month: 1}, -1)).toEqual({year: 2025, month: 12});
  });

  it('12월의 다음 달은 다음 해 1월이다', () => {
    expect(shiftMonth({year: 2025, month: 12}, 1)).toEqual({year: 2026, month: 1});
  });

  it('해 안에서는 달만 바뀐다', () => {
    expect(shiftMonth({year: 2026, month: 9}, 1)).toEqual({year: 2026, month: 10});
  });
});

describe('parseMonth', () => {
  it('주소의 연·월 문자열을 숫자 달로 읽는다', () => {
    expect(parseMonth({year: '2026', month: '9'})).toEqual({year: 2026, month: 9});
  });

  it('기록 API가 받는 경계의 해와 1월·12월을 읽는다', () => {
    expect(parseMonth({year: '1000', month: '1'})).toEqual({year: 1000, month: 1});
    expect(parseMonth({year: '9998', month: '12'})).toEqual({year: 9998, month: 12});
  });

  [
    {month: '0', reason: '0월'},
    {month: '13', reason: '13월'},
    {month: 'abc', reason: '숫자가 아닌 달'},
    {month: '1.5', reason: '정수가 아닌 달'},
    {month: '09', reason: '앞에 0이 붙은 달'},
    {month: '1e1', reason: '지수 표기 달'},
  ].forEach(({month, reason}) => {
    it(`${reason}은 null이다`, () => {
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
    it(`${reason}는 null이다`, () => {
      expect(parseMonth({year, month: '9'})).toBeNull();
    });
  });
});
