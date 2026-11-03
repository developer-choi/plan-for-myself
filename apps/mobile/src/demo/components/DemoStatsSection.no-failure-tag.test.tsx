import {createRef} from 'react';
import type {ScrollView} from 'react-native';
import {render} from '@testing-library/react-native';
import {describe, expect, it} from '@jest/globals';
import {TestSessionProvider} from '@/auth/test-utils';
import {hasSeenDemoTour} from '@/demo/demo-tour-seen';
import {createMonthly} from '@/study-record-stats/test-utils';
import DemoStatsSection from './DemoStatsSection';

describe('DemoStatsSection', () => {
  describe('Edge cases', () => {
    it('실패 태그가 없는 달이면 말풍선을 이미 본 것으로 기록하지 않아야 한다', async () => {
      await render(
        <TestSessionProvider token={null}>
          <DemoStatsSection
            month={{year: 2026, month: 10}}
            monthly={createMonthly({failureTags: []})}
            overview={null}
            records={[]}
            scrollViewRef={createRef<ScrollView>()}
          />
        </TestSessionProvider>,
      );

      expect(hasSeenDemoTour('stats')).toBe(false);
    });
  });
});
