import {createRef} from 'react';
import type {ScrollView} from 'react-native';
import {colors} from '@plan-for-myself/shared/color';
import {render, screen, userEvent} from '@testing-library/react-native';
import {describe, expect, it} from '@jest/globals';
import {TestSessionProvider} from '@/auth/test-utils';
import {TAG_ROW_TEST_ID_PREFIX} from '@/study-record-stats/components/FailCard';
import {DAY_TEST_ID_PREFIX} from '@/study-record-stats/components/TagCalendar';
import {createFailureTag, createMonthly, createStudyRecord} from '@/study-record-stats/test-utils';
import DemoStatsSection from './DemoStatsSection';

describe('DemoStatsSection', () => {
  describe('General cases', () => {
    it('실패 태그를 누르면 그 태그를 적은 날이 달력에서 실패 색으로 보여야 한다', async () => {
      const user = userEvent.setup();
      await renderSection();

      await user.press(screen.getByTestId(TAG_ROW_TEST_ID));

      expect(screen.getByTestId(`${DAY_TEST_ID_PREFIX}${TAGGED_DAY}`)).toHaveStyle({backgroundColor: colors.fail});
    });
  });
});

const MONTH = {year: 2026, month: 10};
const TAG = '늦잠';
const TAG_ROW_TEST_ID = `${TAG_ROW_TEST_ID_PREFIX}${TAG}`;
const MONTHLY = createMonthly({failureTags: [createFailureTag({tag: TAG})]});
const TAGGED_DAY = 5;
const RECORDS = [createStudyRecord({date: '2026-10-05', failTags: [TAG]})];

function renderSection() {
  return render(
    <TestSessionProvider token={null}>
      <DemoStatsSection
        month={MONTH}
        monthly={MONTHLY}
        overview={null}
        records={RECORDS}
        scrollViewRef={createRef<ScrollView>()}
      />
    </TestSessionProvider>,
  );
}
