import {render} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import {createMonthly, getDefinitionByTerm, queryAllTermTexts} from '@/study-record-stats/test-utils';
import StudyCard from './StudyCard';

describe('StudyCard', () => {
  describe('General cases', () => {
    [
      {label: '평일 평균', study: {weekdayAvg: 189, prevWeekdayAvg: 176}, expected: /^3시간 9분지난달 \+13분$/},
      {label: '휴일 평균', study: {holidayAvg: 212, prevHolidayAvg: 244}, expected: /^3시간 32분지난달 −32분$/},
    ].forEach(({label, study, expected}) => {
      it(`${label} 옆에 지난달 평균과의 차이가 보인다`, () => {
        render(<StudyCard monthly={createMonthly({study})} />);

        expect(getDefinitionByTerm(label)).toHaveTextContent(expected);
      });
    });
  });

  describe('Edge cases', () => {
    it('그 달 휴일 기록이 없으면 휴일 평균이 보이지 않는다', () => {
      const monthly = createMonthly({month: '2026-09', study: {weekdayAvg: 189, holidayAvg: null}});
      render(<StudyCard monthly={monthly} />);

      expect(queryAllTermTexts()).toEqual(['9월 총 공부', '평일 평균']);
    });

    it('지난달 평일 기록이 없으면 평일 평균 옆에 지난달 차이가 보이지 않는다', () => {
      render(<StudyCard monthly={createMonthly({study: {weekdayAvg: 189, prevWeekdayAvg: null}})} />);

      expect(getDefinitionByTerm('평일 평균')).toHaveTextContent(/^3시간 9분$/);
    });
  });
});
