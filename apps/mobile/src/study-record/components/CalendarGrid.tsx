import type {Ref} from 'react';
import {Pressable, ScrollView, StyleSheet, View} from 'react-native';
import type {CalendarMonth, StudyRecord} from '@plan-for-myself/shared';
import {colors, getCalendarDayCells, WEEKDAY_LABELS} from '@plan-for-myself/shared';
import Text from '@/shared/components/Text';
import {controlHeight, fontSize, radius, spacing, typography} from '@/shared/styles/design-tokens';

interface CalendarGridProps {
  month: CalendarMonth;
  today: string;
  records: StudyRecord[];
  handlers: {
    onFutureDateClick: () => void;
    /* 그날 기록이 없으면 record는 undefined */
    onRecordableDateClick: (date: string, record?: StudyRecord) => void;
  };
  highlightedCell?: {date: string; ref: Ref<View>};
}

export default function CalendarGrid({month, today, records, handlers, highlightedCell}: CalendarGridProps) {
  return (
    <ScrollView contentContainerStyle={styles.calendar}>
      <View style={styles.weekdays}>
        {WEEKDAY_LABELS.map((label) => (
          <Text key={label} style={[styles.cell, styles.weekday]}>
            {label}
          </Text>
        ))}
      </View>
      <View style={styles.grid}>
        {splitIntoWeeks(getCalendarDayCells(month, today, records)).map((week) => (
          <View key={week[0]?.date} style={styles.week}>
            {week.map(({date, day, inMonth, record, isFuture, isToday, studiedTime, failTags}) => {
              if (!inMonth) {
                return (
                  <View key={date} style={[styles.cell, styles.outsideDay]}>
                    <Text style={[styles.dayNumber, styles.outsideDayNumber]}>{day}</Text>
                  </View>
                );
              }

              return (
                <Pressable
                  key={date}
                  ref={date === highlightedCell?.date ? highlightedCell.ref : undefined}
                  style={[styles.cell, styles.day]}
                  onPress={isFuture ? handlers.onFutureDateClick : () => handlers.onRecordableDateClick(date, record)}
                >
                  <Text style={[styles.dayNumber, styles.recordableDayNumber, isToday && styles.todayNumber]}>
                    {day}
                  </Text>
                  {studiedTime ? (
                    <Text numberOfLines={1} style={[styles.chip, styles.studiedTimeChip]}>
                      {studiedTime}
                    </Text>
                  ) : null}
                  {failTags.map((tag) => (
                    <Text key={tag} ellipsizeMode="clip" numberOfLines={1} style={[styles.chip, styles.failTagChip]}>
                      {tag}
                    </Text>
                  ))}
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const DAYS_PER_WEEK = 7;
const MIN_CELL_HEIGHT = 64;

const styles = StyleSheet.create({
  calendar: {
    flexGrow: 1,
  },
  weekdays: {
    flexDirection: 'row',
    columnGap: spacing.xs / 2,
  },
  weekday: {
    ...typography.body3,
    paddingBottom: spacing.xs,
    color: colors.textMuted,
    textAlign: 'center',
  },
  grid: {
    flex: 1,
    rowGap: spacing.xs,
  },
  week: {
    flex: 1,
    flexDirection: 'row',
    columnGap: spacing.xs / 2,
    minHeight: MIN_CELL_HEIGHT,
  },
  cell: {
    flex: 1,
    minWidth: 0,
    paddingHorizontal: spacing.xs / 2,
  },
  day: {
    alignItems: 'center',
    rowGap: spacing.xs,
    paddingVertical: spacing.xs,
    overflow: 'hidden',
    backgroundColor: colors.card,
    borderRadius: radius.sm,
  },
  outsideDay: {
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  dayNumber: {
    ...typography.body3,
    width: controlHeight.sm,
    height: controlHeight.sm,
    borderRadius: controlHeight.sm / 2,
    overflow: 'hidden',
    textAlign: 'center',
    textAlignVertical: 'center',
    lineHeight: controlHeight.sm,
  },
  outsideDayNumber: {
    color: colors.line,
  },
  recordableDayNumber: {
    color: colors.text,
    fontWeight: 'bold',
  },
  todayNumber: {
    color: colors.onPrimary,
    backgroundColor: colors.primary,
  },
  chip: {
    ...typography.body3,
    alignSelf: 'stretch',
    paddingVertical: spacing.xs / 2,
    paddingHorizontal: spacing.xs / 2,
    fontSize: fontSize.xxs,
    fontWeight: '500',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  studiedTimeChip: {
    color: colors.textSecondary,
    backgroundColor: colors.off,
  },
  failTagChip: {
    color: colors.card,
    backgroundColor: colors.fail,
  },
});

function splitIntoWeeks<T>(cells: T[]): T[][] {
  return Array.from({length: cells.length / DAYS_PER_WEEK}, (_week, index) =>
    cells.slice(index * DAYS_PER_WEEK, (index + 1) * DAYS_PER_WEEK),
  );
}
