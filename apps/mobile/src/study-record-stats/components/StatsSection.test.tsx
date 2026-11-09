import {createRef} from 'react';
import {describe, expect, it} from '@jest/globals';
import type {FailureTagTrend} from '@plan-for-myself/shared/study-record';
import {act, render, screen, userEvent} from '@testing-library/react-native';
import Text from '@/shared/components/Text';
import {createFailureTag, createMonthly} from '@/study-record-stats/test-utils';
import {TAG_ROW_TEST_ID_PREFIX} from './FailCard';
import StatsSection, {type StatsTourTargets} from './StatsSection';

describe('StatsSection', () => {
  describe('General cases', () => {
    it('체험 말풍선이 첫 태그를 열면 첫 태그의 달력이 보여야 한다', async () => {
      const tourTargets = createTourTargets();
      await renderStatsSection(tourTargets);

      await act(() => tourTargets.firstTagOpenerRef.current?.openFirstTag(0));

      expect(screen.getByText(OVERSLEEP_CALENDAR)).toBeOnTheScreen();
    });

    describe('첫 태그의 달력이 이미 열린 상태', () => {
      it('체험 말풍선이 첫 태그를 다시 열어도 달력이 그대로 보여야 한다', async () => {
        const user = userEvent.setup();
        const tourTargets = createTourTargets();
        await renderStatsSection(tourTargets);
        await user.press(screen.getByText(OVERSLEEP.tag));

        await act(() => tourTargets.firstTagOpenerRef.current?.openFirstTag(0));

        expect(screen.getByText(OVERSLEEP_CALENDAR)).toBeOnTheScreen();
      });
    });

    it('태그 줄을 누르기 전에는 태그 달력이 보이지 않아야 한다', async () => {
      await renderStatsSection();

      expect(screen.queryByText(OVERSLEEP_CALENDAR)).not.toBeOnTheScreen();
    });

    it('태그 줄을 누르면 그 태그의 달력이 보여야 한다', async () => {
      const user = userEvent.setup();
      await renderStatsSection();

      await user.press(screen.getByText(OVERSLEEP.tag));

      expect(screen.getByText(OVERSLEEP_CALENDAR)).toBeOnTheScreen();
    });

    describe('태그 줄을 눌러 그 태그의 달력이 열린 상태', () => {
      it('같은 태그 줄을 다시 누르면 그 달력이 사라져야 한다', async () => {
        const user = userEvent.setup();
        await renderStatsSection();

        await user.press(screen.getByTestId(OVERSLEEP_ROW_TEST_ID));
        await user.press(screen.getByTestId(OVERSLEEP_ROW_TEST_ID));

        expect(screen.queryByText(OVERSLEEP_CALENDAR)).not.toBeOnTheScreen();
      });

      it('다른 태그 줄을 누르면 누른 태그의 달력으로 바뀌어야 한다', async () => {
        const user = userEvent.setup();
        await renderStatsSection();

        await user.press(screen.getByText(OVERSLEEP.tag));
        await user.press(screen.getByText(SNACK.tag));

        expect(screen.getByText(SNACK_CALENDAR)).toBeOnTheScreen();
        expect(screen.queryByText(OVERSLEEP_CALENDAR)).not.toBeOnTheScreen();
      });
    });
  });
});

const TWO_MONTH_TREND: FailureTagTrend[] = [
  {month: '2026-09', count: 2, previousCount: 1, status: 'repeated'},
  {month: '2026-10', count: 3, previousCount: 2, status: 'repeated'},
];
const OVERSLEEP = createFailureTag({tag: '늦잠', trend: TWO_MONTH_TREND});
const SNACK = createFailureTag({tag: '야식', trend: TWO_MONTH_TREND});
const CALENDAR_SUFFIX = ' 달력';
const OVERSLEEP_CALENDAR = `${OVERSLEEP.tag}${CALENDAR_SUFFIX}`;
const SNACK_CALENDAR = `${SNACK.tag}${CALENDAR_SUFFIX}`;
const OVERSLEEP_ROW_TEST_ID = `${TAG_ROW_TEST_ID_PREFIX}${OVERSLEEP.tag}`;
const MONTHLY = createMonthly({failureTags: [OVERSLEEP, SNACK]});

function createTourTargets(): StatsTourTargets {
  return {
    failGroupsRef: createRef(),
    firstTagRowRef: createRef(),
    tagDetailCardRef: createRef(),
    firstTagOpenerRef: createRef(),
  };
}

function renderStatsSection(tourTargets?: StatsTourTargets) {
  return render(
    <StatsSection
      monthly={MONTHLY}
      overview={null}
      renderTagCalendar={(tag) => <Text>{`${tag}${CALENDAR_SUFFIX}`}</Text>}
      scrollViewRef={createRef()}
      tourTargets={tourTargets}
    />,
  );
}
