import {render} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import {createMonthly, getDefinitionByTerm, queryAllTermTexts} from '@/study-record-stats/test-utils';
import RecordCard from './RecordCard';

const STREAK_LABEL = '연속 기록';
const RECORDED_DAYS_LABEL = '9월 기록한 날';
const PREVIOUS_MONTH_NOTE = '지난달';

describe('RecordCard', () => {
  describe('General cases', () => {
    it('이번 달이면 연속 기록이 보인다', () => {
      render(<RecordCard monthly={createMonthly()} streak={{current: 14, longest: 49}} />);

      expect(queryAllTermTexts()).toContain(STREAK_LABEL);
    });

    it('지난 달이면 연속 기록이 보이지 않는다', () => {
      render(<RecordCard monthly={createMonthly({month: '2026-08', inProgress: false})} streak={null} />);

      expect(queryAllTermTexts()).not.toContain(STREAK_LABEL);
    });
  });

  describe('Edge cases', () => {
    it('지난달이 첫 기록 뒤의 달이면 지난달 기록한 날 수가 보인다', () => {
      const monthly = createMonthly({month: '2026-09', previousRecordedDays: {count: 28, total: 31}});
      render(<RecordCard monthly={monthly} streak={null} />);

      expect(getDefinitionByTerm(RECORDED_DAYS_LABEL)).toHaveTextContent(PREVIOUS_MONTH_NOTE);
    });

    it('지난달이 첫 기록보다 앞선 달이면 지난달 기록한 날 수가 보이지 않는다', () => {
      const monthly = createMonthly({month: '2026-09', previousRecordedDays: null});
      render(<RecordCard monthly={monthly} streak={null} />);

      expect(getDefinitionByTerm(RECORDED_DAYS_LABEL)).not.toHaveTextContent(PREVIOUS_MONTH_NOTE);
    });
  });
});
