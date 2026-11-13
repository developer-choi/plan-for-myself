import {describe, expect, it} from '@jest/globals';
import {colors} from '@plan-for-myself/shared/color';
import type {TrendBar} from '@plan-for-myself/shared/study-record-stats';
import {render, screen} from '@testing-library/react-native';
import TrendBars, {BAR_TEST_ID_PREFIX, EMPTY_SLOT_TEST_ID, HATCHED_BAR_TEST_ID_PREFIX} from './TrendBars';

const AUGUST = '8월';
const SEPTEMBER = '9월';
const REPEATED_BAR: TrendBar = {label: AUGUST, value: 2, status: 'repeated'};
const REDUCED_BAR: TrendBar = {label: SEPTEMBER, value: 1, status: 'reduced'};
const BAR_COLOR_CASES = [
  {name: '줄어든 달 막대는 초록이어야 한다', bar: REDUCED_BAR, color: colors.success},
  {name: '반복한 달 막대는 빨강이어야 한다', bar: REPEATED_BAR, color: colors.fail},
];

describe('TrendBars', () => {
  describe('General cases', () => {
    it('막대가 여섯 개면 여섯 달 이름이 모두 보여야 한다', async () => {
      await render(<TrendBars bars={SIX_BARS} inProgress={false} />);

      SIX_MONTH_LABELS.forEach((label) => expect(screen.getByText(label)).toBeOnTheScreen());
    });

    describe('진행 중인 달 추이', () => {
      it('마지막 막대의 월 이름 아래에 「진행 중」이 보여야 한다', async () => {
        await render(<TrendBars inProgress bars={THREE_BARS} />);

        const texts = screen.getAllByText(LABELS_AND_IN_PROGRESS);
        expect(texts.indexOf(screen.getByText(IN_PROGRESS))).toBe(texts.indexOf(screen.getByText(JUNE)) + 1);
      });

      it('「진행 중」은 하나만 보여야 한다', async () => {
        await render(<TrendBars inProgress bars={THREE_BARS} />);

        expect(screen.getAllByText(IN_PROGRESS)).toHaveLength(1);
      });

      it('마지막 막대는 빗금 막대로 그려야 한다', async () => {
        await render(<TrendBars inProgress bars={THREE_BARS} />);

        expect(screen.getByTestId(`${HATCHED_BAR_TEST_ID_PREFIX}${JUNE}`)).toBeOnTheScreen();
        expect(screen.queryByTestId(`${BAR_TEST_ID_PREFIX}${JUNE}`)).not.toBeOnTheScreen();
      });

      it('빗금 막대 높이는 그 달 값을 가장 큰 값에 견준 비율로 그려야 한다', async () => {
        const maxBar: TrendBar = {label: SEPTEMBER, value: 4, status: 'repeated'};
        const inProgressBar: TrendBar = {label: OCTOBER, value: 2, status: 'repeated'};
        await render(<TrendBars inProgress bars={[maxBar, inProgressBar]} />);

        expect(screen.getByTestId(`${HATCHED_BAR_TEST_ID_PREFIX}${OCTOBER}`)).toHaveStyle({height: HALF_BAR_HEIGHT});
      });
    });

    BAR_COLOR_CASES.forEach(({name, bar, color}) => {
      it(name, async () => {
        await render(<TrendBars bars={[REPEATED_BAR, REDUCED_BAR]} inProgress={false} />);

        expect(screen.getByTestId(`${BAR_TEST_ID_PREFIX}${bar.label}`)).toHaveStyle({backgroundColor: color});
      });
    });

    it('막대 높이는 그 달 값을 가장 큰 값에 견준 비율로 그려야 한다', async () => {
      const maxBar: TrendBar = {label: SEPTEMBER, value: 4, status: 'repeated'};
      await render(<TrendBars bars={[REPEATED_BAR, maxBar]} inProgress={false} />);

      expect(screen.getByTestId(`${BAR_TEST_ID_PREFIX}${REPEATED_BAR.label}`)).toHaveStyle({height: HALF_BAR_HEIGHT});
      expect(screen.getByTestId(`${BAR_TEST_ID_PREFIX}${maxBar.label}`)).toHaveStyle({height: MAX_BAR_HEIGHT});
    });

    it('값이 0이 아니면 막대 위에 그 숫자가 보여야 한다', async () => {
      await render(<TrendBars bars={[REPEATED_BAR]} inProgress={false} />);

      expect(screen.getByText(String(REPEATED_BAR.value))).toBeOnTheScreen();
    });

    it('끝난 달까지의 추이면 「진행 중」이 보이지 않아야 한다', async () => {
      await render(<TrendBars bars={THREE_BARS} inProgress={false} />);

      expect(screen.queryByText(IN_PROGRESS)).not.toBeOnTheScreen();
    });
  });

  describe('Edge cases', () => {
    it('값이 0이면 막대 위 숫자가 보이지 않아야 한다', async () => {
      await render(<TrendBars bars={[ZERO_BAR]} inProgress={false} />);

      expect(screen.queryByText('0')).not.toBeOnTheScreen();
    });

    it('값이 0이어도 월 이름은 보여야 한다', async () => {
      await render(<TrendBars bars={[ZERO_BAR]} inProgress={false} />);

      expect(screen.getByText(SEPTEMBER)).toBeOnTheScreen();
    });

    describe('막대가 막대 자리보다 적은 두 개', () => {
      it('앞 네 자리는 비어야 한다', async () => {
        await render(<TrendBars bars={[REPEATED_BAR, REDUCED_BAR]} inProgress={false} />);

        const slots = screen.getAllByTestId(SLOT_TEST_ID_PATTERN);
        const emptySlotIndexes = screen.getAllByTestId(EMPTY_SLOT_TEST_ID).map((slot) => slots.indexOf(slot));
        expect(emptySlotIndexes).toEqual(
          Array.from({length: EMPTY_SLOTS_BEFORE_TWO_BARS}, (_slot, slotIndex) => slotIndex),
        );
      });

      it('막대는 오른쪽 두 자리에 그려져야 한다', async () => {
        await render(<TrendBars bars={[REPEATED_BAR, REDUCED_BAR]} inProgress={false} />);

        const slots = screen.getAllByTestId(SLOT_TEST_ID_PATTERN);
        const barIndexes = [REPEATED_BAR, REDUCED_BAR].map(({label}) =>
          slots.indexOf(screen.getByTestId(`${BAR_TEST_ID_PREFIX}${label}`)),
        );
        expect(barIndexes).toEqual([EMPTY_SLOTS_BEFORE_TWO_BARS, EMPTY_SLOTS_BEFORE_TWO_BARS + 1]);
      });
    });

    it('막대가 여섯 개면 빈 자리가 없어야 한다', async () => {
      await render(<TrendBars bars={SIX_BARS} inProgress={false} />);

      expect(screen.queryAllByTestId(EMPTY_SLOT_TEST_ID)).toHaveLength(0);
    });
  });
});

const IN_PROGRESS = '진행 중';
const JUNE = '6월';
const OCTOBER = '10월';
const SIX_MONTH_LABELS = ['4월', '5월', JUNE, '7월', AUGUST, SEPTEMBER];
const SIX_BARS: TrendBar[] = SIX_MONTH_LABELS.map((label) => ({label, value: 1, status: 'repeated'}));
const THREE_BARS = SIX_BARS.slice(0, SIX_MONTH_LABELS.indexOf(JUNE) + 1);
const ZERO_BAR: TrendBar = {label: SEPTEMBER, value: 0, status: 'repeated'};
const EMPTY_SLOTS_BEFORE_TWO_BARS = 4;
const SLOT_TEST_ID_PATTERN = new RegExp(`^(${EMPTY_SLOT_TEST_ID}|${BAR_TEST_ID_PREFIX})`);
const LABELS_AND_IN_PROGRESS = new RegExp(`^(\\d+월|${IN_PROGRESS})$`);
const MAX_BAR_HEIGHT = 56;
const HALF_BAR_HEIGHT = MAX_BAR_HEIGHT / 2;
