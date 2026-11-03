import {createRef} from 'react';
import {describe, expect, it} from '@jest/globals';
import type {TrendBar} from '@plan-for-myself/shared';
import {render, screen} from '@testing-library/react-native';
import Text from '@/shared/components/Text';
import TagDetailCard from './TagDetailCard';

describe('TagDetailCard', () => {
  describe('Boundary cases', () => {
    it('추이 막대가 두 개면 월별 추이가 보여야 한다', async () => {
      await render(
        <TagDetailCard ref={createRef()} calendar={CALENDAR} tag={TAG} trend={{bars: TWO_BARS, inProgress: false}} />,
      );

      TWO_BARS.forEach(({label}) => expect(screen.getByText(label)).toBeOnTheScreen());
    });

    it('추이 막대가 한 개뿐이면 월별 추이가 보이지 않아야 한다', async () => {
      await render(
        <TagDetailCard ref={createRef()} calendar={CALENDAR} tag={TAG} trend={{bars: ONE_BAR, inProgress: false}} />,
      );

      expect(screen.queryByText(SEPTEMBER)).not.toBeOnTheScreen();
    });

    it('추이 막대가 한 개뿐이어도 태그 달력은 보여야 한다', async () => {
      await render(
        <TagDetailCard ref={createRef()} calendar={CALENDAR} tag={TAG} trend={{bars: ONE_BAR, inProgress: false}} />,
      );

      expect(screen.getByText(CALENDAR_PLACEHOLDER)).toBeOnTheScreen();
    });
  });
});

const TAG = '야식';
const CALENDAR_PLACEHOLDER = '달력 자리';
const CALENDAR = <Text>{CALENDAR_PLACEHOLDER}</Text>;
const SEPTEMBER = '9월';
const THREE_MONTH_LABELS = ['7월', '8월', SEPTEMBER];
const THREE_BARS: TrendBar[] = THREE_MONTH_LABELS.map((label) => ({label, value: 1, status: 'repeated'}));
const TWO_BARS = THREE_BARS.slice(1);
const ONE_BAR = THREE_BARS.slice(-1);
