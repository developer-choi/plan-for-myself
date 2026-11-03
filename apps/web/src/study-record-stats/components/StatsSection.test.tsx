import type {CalendarMonth, FailureTag, StudyRecordOverview} from '@plan-for-myself/shared';
import {toMonthParam} from '@plan-for-myself/shared';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {describe, expect, it} from 'vitest';
import {createMonthly, getDefinitionByTerm, queryAllTermTexts} from '@/study-record-stats/test-utils';
import StatsSection from './StatsSection';

const CURRENT_MONTH: CalendarMonth = {year: 2026, month: 9};
const PREVIOUS_MONTH: CalendarMonth = {year: 2026, month: 8};
const CURRENT_MONTH_ONLY_LABELS = ['누적 기록', '누적 총 공부', '연속 기록'];
const FAIL_CARD_CASES = [
  {when: '이번 달', month: CURRENT_MONTH, title: '9월 실패'},
  {when: '지난 달', month: PREVIOUS_MONTH, title: '8월 실패'},
];

describe('StatsSection', () => {
  describe('General cases', () => {
    CURRENT_MONTH_ONLY_LABELS.forEach((label) => {
      it(`이번 달이면 ${label} 줄이 보인다`, () => {
        renderStatsSection(CURRENT_MONTH);

        expect(queryAllTermTexts()).toContain(label);
      });

      it(`지난 달이면 ${label} 줄이 보이지 않는다`, () => {
        renderStatsSection(PREVIOUS_MONTH);

        expect(queryAllTermTexts()).not.toContain(label);
      });
    });

    it('이번 달이면 누적 기록에 기록한 날 수가, 누적 총 공부에 공부 시간이 보인다', () => {
      renderStatsSection(CURRENT_MONTH);

      expect(getDefinitionByTerm('누적 기록')).toHaveTextContent(/^412일$/);
      expect(getDefinitionByTerm('누적 총 공부')).toHaveTextContent(/^523시간$/);
    });

    it('지난 달이면 그 달 기록 줄이 보인다', () => {
      renderStatsSection(PREVIOUS_MONTH);

      expect(queryAllTermTexts()).toContain(PREVIOUS_MONTH_RECORDED_DAYS_LABEL);
    });

    FAIL_CARD_CASES.forEach(({when, month, title}) => {
      it(`${when}이면 실패 카드가 보인다`, () => {
        renderStatsSection(month);

        expect(screen.getByRole('heading', {name: title})).toBeInTheDocument();
      });
    });

    it('태그를 누르기 전에는 태그 상세 카드가 보이지 않아야 한다', () => {
      renderStatsSection(CURRENT_MONTH, [OVERSLEEP]);

      expect(screen.queryByRole('heading', {name: OVERSLEEP.tag})).not.toBeInTheDocument();
    });

    it('태그 줄을 누르면 그 태그 이름이 제목인 카드가 보인다', async () => {
      renderStatsSection(CURRENT_MONTH, [OVERSLEEP]);

      await userEvent.click(screen.getByRole('button', {name: new RegExp(OVERSLEEP.tag)}));

      expect(screen.getByRole('heading', {name: OVERSLEEP.tag})).toBeInTheDocument();
    });

    it('태그 줄을 누르면 실패 카드에서 그 줄만 강조된다', async () => {
      renderStatsSection(CURRENT_MONTH, [OVERSLEEP, SNACK]);

      await userEvent.click(screen.getByRole('button', {name: new RegExp(OVERSLEEP.tag)}));

      expect(screen.getByRole('button', {name: new RegExp(OVERSLEEP.tag)})).toHaveAttribute('data-selected');
      expect(screen.getByRole('button', {name: new RegExp(SNACK.tag)})).not.toHaveAttribute('data-selected');
    });

    describe('태그 줄을 눌러 그 태그 이름이 제목인 카드가 열린 상태', () => {
      it('같은 태그 줄을 다시 누르면 그 카드가 사라진다', async () => {
        renderStatsSection(CURRENT_MONTH, [OVERSLEEP]);

        await userEvent.click(screen.getByRole('button', {name: new RegExp(OVERSLEEP.tag)}));
        await userEvent.click(screen.getByRole('button', {name: new RegExp(OVERSLEEP.tag)}));

        expect(screen.queryByRole('heading', {name: OVERSLEEP.tag})).not.toBeInTheDocument();
      });

      it('다른 태그 줄을 누르면 카드 제목이 누른 태그 이름으로 바뀐다', async () => {
        renderStatsSection(CURRENT_MONTH, [OVERSLEEP, SNACK]);

        await userEvent.click(screen.getByRole('button', {name: new RegExp(OVERSLEEP.tag)}));
        await userEvent.click(screen.getByRole('button', {name: new RegExp(SNACK.tag)}));

        expect(screen.getByRole('heading', {name: SNACK.tag})).toBeInTheDocument();
        expect(screen.queryByRole('heading', {name: OVERSLEEP.tag})).not.toBeInTheDocument();
      });
    });
  });
});

const TODAY = '2026-09-24';
const PREVIOUS_MONTH_RECORDED_DAYS_LABEL = '8월 기록';
const OVERSLEEP: FailureTag = {
  tag: '늦잠',
  count: 4,
  previousCount: 3,
  status: 'repeated',
  trend: [{month: '2026-09', count: 4, previousCount: 3, status: 'repeated'}],
};
const SNACK: FailureTag = {
  tag: '야식',
  count: 2,
  previousCount: 1,
  status: 'repeated',
  trend: [{month: '2026-09', count: 2, previousCount: 1, status: 'repeated'}],
};
const OVERVIEW: StudyRecordOverview = {
  date: TODAY,
  firstRecordDate: '2025-01-01',
  streak: {current: 14, longest: 49},
  totals: {recordedDays: 412, studiedMinutes: 31380},
};

function renderStatsSection(month: CalendarMonth, failureTags: FailureTag[] = []) {
  const monthParam = toMonthParam(month);
  const isCurrentMonth = monthParam === toMonthParam(CURRENT_MONTH);

  render(
    <StatsSection
      monthly={createMonthly({month: monthParam, inProgress: isCurrentMonth, failureTags})}
      overview={isCurrentMonth ? OVERVIEW : null}
      renderTagCalendar={() => null}
    />,
  );
}
