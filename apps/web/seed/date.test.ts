import {describe, expect, it} from 'vitest';
import {getMonthDay, toRecordTimestamp} from './date';

describe('getMonthDay', () => {
  it('1월에서 한 달 전은 지난해 12월이다', () => {
    expect(getMonthDay({year: 2027, month: 1, date: 15}, -1)).toEqual({year: 2026, month: 12, date: 1});
  });
});

describe('toRecordTimestamp', () => {
  it('그 날 한국 시간 13:00의 밀리초다', () => {
    expect(toRecordTimestamp({year: 2026, month: 9, date: 24})).toBe(Date.parse('2026-09-24T13:00:00+09:00'));
  });
});
