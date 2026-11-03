import {Suspense} from 'react';
import {StyleSheet, View} from 'react-native';
import {Redirect, useLocalSearchParams} from 'expo-router';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  colors,
  DEMO_HOME_URL,
  demoCalendarPath,
  formatMonthTitle,
  parseMonth,
  shiftMonth,
} from '@plan-for-myself/shared';
import DemoBanner from '@/demo/components/DemoBanner';
import DemoCalendarMenu from '@/demo/components/DemoCalendarMenu';
import FetchedDemoCalendarSection from '@/demo/components/FetchedDemoCalendarSection';
import HandledErrorBoundary from '@/shared/components/HandledErrorBoundary';
import LoadingSpinner from '@/shared/components/LoadingSpinner';
import {spacing} from '@/shared/styles/design-tokens';
import CalendarHeader from '@/study-record/components/CalendarHeader';

export default function DemoCalendarScreen() {
  const viewMonth = parseMonth(useLocalSearchParams<{year: string; month: string}>());

  if (!viewMonth) {
    return <Redirect href={DEMO_HOME_URL} />;
  }

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.shell}>
      <DemoBanner />
      <CalendarHeader
        menu={<DemoCalendarMenu />}
        nextHref={demoCalendarPath(shiftMonth(viewMonth, 1))}
        previousHref={demoCalendarPath(shiftMonth(viewMonth, -1))}
        title={formatMonthTitle(viewMonth)}
      />
      <View style={styles.body}>
        <HandledErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <FetchedDemoCalendarSection month={viewMonth} />
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
