import {StyleSheet, View} from 'react-native';
import {colors} from '@plan-for-myself/shared/color';
import type {TagCalendarData} from '@plan-for-myself/shared/study-record-stats';
import {WEEKDAY_LABELS} from '@plan-for-myself/shared/date';
import Text from '@/shared/components/Text';
import {radius, spacing, typography} from '@/shared/styles/design-tokens';

interface TagCalendarProps {
  calendar: TagCalendarData;
}

export default function TagCalendar({calendar}: TagCalendarProps) {
  return (
    <View style={styles.calendar}>
      <View style={styles.row}>
        {WEEKDAY_LABELS.map((label) => (
          <View key={label} style={styles.cell}>
            <Text style={styles.weekday}>{label}</Text>
          </View>
        ))}
      </View>
      <View style={styles.grid}>
        {Array.from({length: calendar.leadingBlanks}, (_blank, blankIndex) => (
          <View key={`blank-${blankIndex}`} style={styles.cell} testID={LEADING_BLANK_TEST_ID} />
        ))}
        {calendar.days.map(({date, day, state}) => (
          <View key={date} style={styles.cell}>
            <View style={[styles.day, dayStates[state]]} testID={`${DAY_TEST_ID_PREFIX}${day}`}>
              <Text style={[styles.dayText, dayTextStates[state]]}>{day}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

export const LEADING_BLANK_TEST_ID = 'tag-calendar-leading-blank';
export const DAY_TEST_ID_PREFIX = 'tag-calendar-day-';

const COLUMN_COUNT = 7;
const MAX_WIDTH = 450;
const FULL_PERCENT = 100;
const CELL_WIDTH = `${FULL_PERCENT / COLUMN_COUNT}%` satisfies `${number}%`;

const styles = StyleSheet.create({
  calendar: {
    gap: spacing.xs,
    maxWidth: MAX_WIDTH,
  },
  row: {
    flexDirection: 'row',
    margin: -spacing.xs / 2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: -spacing.xs / 2,
  },
  cell: {
    width: CELL_WIDTH,
    padding: spacing.xs / 2,
  },
  weekday: {
    ...typography.body3,
    paddingBottom: spacing.xs,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  day: {
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.sm,
  },
  dayText: {
    ...typography.body3,
    fontVariant: ['tabular-nums'],
  },
});

const dayStates = StyleSheet.create({
  hit: {backgroundColor: colors.fail},
  none: {backgroundColor: colors.page},
});

const dayTextStates = StyleSheet.create({
  hit: {fontWeight: 'bold', color: colors.onPrimary},
  none: {color: colors.text},
});
