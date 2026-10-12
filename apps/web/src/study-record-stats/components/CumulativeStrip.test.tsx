import type {StudyRecordOverview} from '@plan-for-myself/shared';
import {render} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import {createMonthly, getDefinitionByTerm} from '@/study-record-stats/test-utils';
import CumulativeStrip from './CumulativeStrip';

describe('CumulativeStrip', () => {
  describe('General cases', () => {
    it('누적 공부는 「N시간 M분」으로 보이고 뒤에 단위가 더 붙지 않는다', () => {
      const threeHoursNineMinutes = 189;

      render(
        <CumulativeStrip monthly={createMonthly()} totals={createTotals({studiedMinutes: threeHoursNineMinutes})} />,
      );

      expect(getDefinitionByTerm('누적 공부')).toHaveTextContent(/^3시간 9분$/);
    });

    it('누적 기록은 숫자 뒤에 「일」이 붙는다', () => {
      const recordedDays = 35;

      render(<CumulativeStrip monthly={createMonthly()} totals={createTotals({recordedDays})} />);

      expect(getDefinitionByTerm('누적 기록')).toHaveTextContent(/^35일$/);
    });
  });

  describe('Boundary cases', () => {
    it('누적 공부가 100시간을 넘으면 분 없이 시간만 보인다', () => {
      const thousandHours = 60000;

      render(<CumulativeStrip monthly={createMonthly()} totals={createTotals({studiedMinutes: thousandHours})} />);

      expect(getDefinitionByTerm('누적 공부')).toHaveTextContent(/^1,000시간$/);
    });
  });
});

function createTotals(overrides: Partial<StudyRecordOverview['totals']> = {}): StudyRecordOverview['totals'] {
  return {recordedDays: 10, studiedMinutes: 600, improvedFailures: 0, ...overrides};
}
