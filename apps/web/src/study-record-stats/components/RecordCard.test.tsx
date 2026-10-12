import {render} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import {createMonthly, getDefinitionByTerm, queryAllTermTexts} from '@/study-record-stats/test-utils';
import RecordCard from './RecordCard';

const STREAK_LABEL = '연속 기록';
const RECORDED_DAYS_LABEL = '9월 기록';
const TOTAL_LABEL = '누적 기록';

describe('RecordCard', () => {
  describe('General cases', () => {
    it('이번 달이면 연속 기록이 보인다', () => {
      render(<RecordCard monthly={createMonthly()} streak={{current: 14, longest: 49}} totalRecordedDays={null} />);

      expect(queryAllTermTexts()).toContain(STREAK_LABEL);
    });

    it('지난 달이면 연속 기록이 보이지 않는다', () => {
      render(
        <RecordCard
          monthly={createMonthly({month: '2026-08', inProgress: false})}
          streak={null}
          totalRecordedDays={null}
        />,
      );

      expect(queryAllTermTexts()).not.toContain(STREAK_LABEL);
    });

    it('기록 줄 값으로 못 남긴 날 수를 문장으로 보인다', () => {
      const recordedDays = {count: 19, total: 30};
      const missedDays = recordedDays.total - recordedDays.count;
      render(
        <RecordCard monthly={createMonthly({month: '2026-09', recordedDays})} streak={null} totalRecordedDays={null} />,
      );

      expect(getDefinitionByTerm(RECORDED_DAYS_LABEL)).toHaveTextContent(
        new RegExp(`^남기지 못한 날이 ${missedDays}일 있어요$`),
      );
    });

    it('세는 대상 날을 모두 남겼으면 빠짐없이 남겼다고 보인다', () => {
      render(
        <RecordCard
          monthly={createMonthly({recordedDays: {count: 30, total: 30}})}
          streak={null}
          totalRecordedDays={null}
        />,
      );

      expect(getDefinitionByTerm(RECORDED_DAYS_LABEL)).toHaveTextContent(/^빠짐없이 남겼어요$/);
    });

    it('이번 달이면 맨 아래에 누적 기록이 보인다', () => {
      render(<RecordCard monthly={createMonthly()} streak={{current: 14, longest: 49}} totalRecordedDays={35} />);

      expect(queryAllTermTexts().at(-1)).toBe(TOTAL_LABEL);
    });

    it('누적 기록은 숫자 뒤에 「일」이 붙는다', () => {
      render(<RecordCard monthly={createMonthly()} streak={null} totalRecordedDays={35} />);

      expect(getDefinitionByTerm(TOTAL_LABEL)).toHaveTextContent(/^35일$/);
    });

    it('지난 달이면 누적 기록이 보이지 않는다', () => {
      render(
        <RecordCard
          monthly={createMonthly({month: '2026-08', inProgress: false})}
          streak={null}
          totalRecordedDays={null}
        />,
      );

      expect(queryAllTermTexts()).not.toContain(TOTAL_LABEL);
    });
  });

  describe('Boundary cases', () => {
    it('세는 대상 날이 없으면(그달 1일 기록 전) 첫 기록을 권한다', () => {
      render(
        <RecordCard
          monthly={createMonthly({recordedDays: {count: 0, total: 0}})}
          streak={null}
          totalRecordedDays={null}
        />,
      );

      expect(getDefinitionByTerm(RECORDED_DAYS_LABEL)).toHaveTextContent(/^오늘 첫 기록을 남겨 보세요$/);
    });

    it('누적 기록이 천 일부터 천 단위마다 쉼표를 넣는다', () => {
      render(<RecordCard monthly={createMonthly()} streak={null} totalRecordedDays={1000} />);

      expect(getDefinitionByTerm(TOTAL_LABEL)).toHaveTextContent(/^1,000일$/);
    });
  });
});
