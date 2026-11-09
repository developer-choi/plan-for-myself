import {Suspense, useRef} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {useLocalSearchParams} from 'expo-router';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors} from '@plan-for-myself/shared/color';
import {isFutureMonth} from '@plan-for-myself/shared/study-record';
import {parseMonth} from '@plan-for-myself/shared/date';
import HandledErrorBoundary from '@/shared/components/HandledErrorBoundary';
import LoadingSpinner from '@/shared/components/LoadingSpinner';
import useKoreanToday from '@/shared/hooks/useKoreanToday';
import {spacing} from '@/shared/styles/design-tokens';
import FetchedStatsHeader from '@/study-record-stats/components/FetchedStatsHeader';
import FetchedStatsSection from '@/study-record-stats/components/FetchedStatsSection';
import StatsMonthGuard from '@/study-record-stats/components/StatsMonthGuard';
import ThisMonthStatsRedirect from '@/study-record-stats/components/ThisMonthStatsRedirect';

export default function StudyRecordStatsScreen() {
  const viewMonth = parseMonth(useLocalSearchParams<{year: string; month: string}>());
  const today = useKoreanToday();
  const scrollViewRef = useRef<ScrollView>(null);

  if (!viewMonth || isFutureMonth(today, viewMonth)) {
    return <ThisMonthStatsRedirect today={today} />;
  }

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.shell}>
      <FetchedStatsHeader month={viewMonth} today={today} />
      <ScrollView ref={scrollViewRef} contentContainerStyle={styles.body}>
        <HandledErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <StatsMonthGuard month={viewMonth} today={today}>
              <FetchedStatsSection month={viewMonth} scrollViewRef={scrollViewRef} today={today} />
            </StatsMonthGuard>
          </Suspense>
        </HandledErrorBoundary>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    backgroundColor: colors.page,
  },
  body: {
    flexGrow: 1,
    paddingHorizontal: spacing.pageXMobile,
    paddingBottom: spacing.xxl,
  },
});
