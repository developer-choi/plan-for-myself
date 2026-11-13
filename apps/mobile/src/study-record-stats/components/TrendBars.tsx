import {StyleSheet, View} from 'react-native';
import Svg, {Line, Rect} from 'react-native-svg';
import {colors} from '@plan-for-myself/shared/color';
import {FAILURE_TAG_TREND_MONTH_LIMIT} from '@plan-for-myself/shared/study-record';
import {STATS_TEXT, type TrendBar} from '@plan-for-myself/shared/study-record-stats';
import Text from '@/shared/components/Text';
import {spacing, typography} from '@/shared/styles/design-tokens';

interface TrendBarsProps {
  bars: TrendBar[];
  inProgress: boolean;
}

interface HatchedBarProps {
  height: number;
  colors: BarColors;
  testID: string;
}

interface BarColors {
  color: string;
  pairColor: string;
}

export default function TrendBars({bars, inProgress}: TrendBarsProps) {
  const emptySlotCount = FAILURE_TAG_TREND_MONTH_LIMIT - bars.length;
  const max = Math.max(...bars.map((bar) => bar.value), 1);

  return (
    <View style={styles.bars}>
      <View style={styles.axis} />
      {Array.from({length: emptySlotCount}, (_empty, slotIndex) => (
        <View key={`empty-${slotIndex}`} style={styles.column} testID={EMPTY_SLOT_TEST_ID} />
      ))}
      {bars.map((bar, index) => {
        const isInProgressBar = inProgress && index === bars.length - 1;
        const height = (bar.value / max) * BAR_MAX_HEIGHT;

        return (
          <View key={bar.label} style={styles.column}>
            <Text style={styles.value}>{bar.value || ''}</Text>
            {isInProgressBar ? (
              <HatchedBar
                colors={BAR_COLORS[bar.status]}
                height={height}
                testID={`${HATCHED_BAR_TEST_ID_PREFIX}${bar.label}`}
              />
            ) : (
              <View
                style={[styles.bar, {height, backgroundColor: BAR_COLORS[bar.status].color}]}
                testID={`${BAR_TEST_ID_PREFIX}${bar.label}`}
              />
            )}
            <View style={styles.label}>
              <Text style={styles.labelText}>{bar.label}</Text>
              {isInProgressBar && <Text style={styles.labelText}>{STATS_TEXT.inProgressLabel}</Text>}
            </View>
          </View>
        );
      })}
    </View>
  );
}

export const EMPTY_SLOT_TEST_ID = 'trend-empty-slot';
export const BAR_TEST_ID_PREFIX = 'trend-bar-';
export const HATCHED_BAR_TEST_ID_PREFIX = 'trend-hatched-bar-';

const TREND_HEIGHT = 108;
const LABEL_HEIGHT = 36;
const BAR_WIDTH = 30;
const BAR_MAX_HEIGHT = 56;
const BAR_TOP_RADIUS = 4;
const HATCH_STROKE_WIDTH = 3;
const HATCH_PERIOD = 6;

const BAR_COLORS: Record<TrendBar['status'], BarColors> = {
  repeated: {color: colors.fail, pairColor: colors.failLight},
  reduced: {color: colors.success, pairColor: colors.successSoft},
};

const styles = StyleSheet.create({
  bars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: TREND_HEIGHT,
  },
  axis: {
    position: 'absolute',
    right: 0,
    bottom: LABEL_HEIGHT - 1,
    left: 0,
    height: 1,
    backgroundColor: colors.line,
  },
  column: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
  },
  value: {
    ...typography.body3,
    marginBottom: spacing.xs,
    color: colors.textSecondary,
    fontVariant: ['tabular-nums'],
  },
  bar: {
    width: BAR_WIDTH,
    borderTopLeftRadius: BAR_TOP_RADIUS,
    borderTopRightRadius: BAR_TOP_RADIUS,
  },
  hatchedBar: {
    width: BAR_WIDTH,
    overflow: 'hidden',
    borderTopLeftRadius: BAR_TOP_RADIUS,
    borderTopRightRadius: BAR_TOP_RADIUS,
  },
  label: {
    alignItems: 'center',
    alignSelf: 'stretch',
    height: LABEL_HEIGHT,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: 'transparent',
  },
  labelText: {
    ...typography.body3,
    color: colors.textMuted,
    textAlign: 'center',
  },
});

function HatchedBar({height, colors: barColors, testID}: HatchedBarProps) {
  return (
    <View style={[styles.hatchedBar, {height}]} testID={testID}>
      <Svg height={height} width={BAR_WIDTH}>
        <Rect fill={barColors.pairColor} height={height} width={BAR_WIDTH} />
        {getHatchOffsets(height).map((offset) => (
          <Line
            key={offset}
            stroke={barColors.color}
            strokeWidth={HATCH_STROKE_WIDTH}
            x1={offset - HATCH_STROKE_WIDTH}
            x2={offset + height + HATCH_STROKE_WIDTH}
            y1={-HATCH_STROKE_WIDTH}
            y2={height + HATCH_STROKE_WIDTH}
          />
        ))}
      </Svg>
    </View>
  );
}

/* 웹 repeating-linear-gradient(45deg)는 왼쪽 아래 모서리에서 색 띠가 시작한다. 띠 가운데를 지나는 선 x − y = offset을 그 위치에 맞춘다 */
function getHatchOffsets(height: number): number[] {
  const firstOffset = -height + Math.SQRT2 * (HATCH_STROKE_WIDTH / 2);
  const step = Math.SQRT2 * HATCH_PERIOD;
  const count = Math.ceil((BAR_WIDTH + height) / step) + 1;

  return Array.from({length: count}, (_line, lineIndex) => firstOffset + step * lineIndex);
}
