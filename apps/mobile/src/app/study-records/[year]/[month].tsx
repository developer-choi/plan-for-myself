import {Suspense} from 'react';
import {StyleSheet, View} from 'react-native';
import {Redirect, useLocalSearchParams} from 'expo-router';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors, formatMonthTitle, monthPath, parseMonth, shiftMonth} from '@plan-for-myself/shared';
import HandledErrorBoundary from '@/shared/components/HandledErrorBoundary';
import LoadingSpinner from '@/shared/components/LoadingSpinner';
import useKoreanToday from '@/shared/hooks/useKoreanToday';
import {spacing} from '@/shared/styles/design-tokens';
import CalendarHeader from '@/study-record/components/CalendarHeader';
import CalendarMenu from '@/study-record/components/CalendarMenu';
import FetchedCalendarSection from '@/study-record/components/FetchedCalendarSection';

export default function CalendarScreen() {
  const viewMonth = parseMonth(useLocalSearchParams<{year: string; month: string}>());
  const today = useKoreanToday();

  if (!viewMonth) {
    return <Redirect href="/" />;
  }

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.shell}>
      <CalendarHeader
        menu={<CalendarMenu />}
        nextHref={monthPath(shiftMonth(viewMonth, 1))}
        previousHref={monthPath(shiftMonth(viewMonth, -1))}
        title={formatMonthTitle(viewMonth)}
      />
      <View style={styles.body}>
        <HandledErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <FetchedCalendarSection month={viewMonth} today={today} />
          </Suspense>
        </HandledErrorBoundary>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    backgroundColor: colors.page,
  },
  body: {
    flex: 1,
    paddingHorizontal: spacing.pageXMobile,
    paddingBottom: spacing.md,
  },
});
