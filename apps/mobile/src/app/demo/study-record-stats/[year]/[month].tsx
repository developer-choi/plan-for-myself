import {Suspense} from 'react';
import {StyleSheet} from 'react-native';
import {Redirect, useLocalSearchParams} from 'expo-router';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors} from '@plan-for-myself/shared/color';
import {DEMO_HOME_URL} from '@plan-for-myself/shared/demo';
import {parseMonth} from '@plan-for-myself/shared/date';
import DemoBanner from '@/demo/components/DemoBanner';
import FetchedDemoStats from '@/demo/components/FetchedDemoStats';
import FetchedDemoStatsHeader from '@/demo/components/FetchedDemoStatsHeader';
import HandledErrorBoundary from '@/shared/components/HandledErrorBoundary';
import LoadingSpinner from '@/shared/components/LoadingSpinner';

export default function DemoStatsScreen() {
  const viewMonth = parseMonth(useLocalSearchParams<{year: string; month: string}>());

  if (!viewMonth) {
    return <Redirect href={DEMO_HOME_URL} />;
  }

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.shell}>
      <DemoBanner />
      <HandledErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <FetchedDemoStatsHeader month={viewMonth} />
          <Suspense fallback={<LoadingSpinner />}>
            <FetchedDemoStats month={viewMonth} />
          </Suspense>
        </Suspense>
      </HandledErrorBoundary>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    backgroundColor: colors.page,
  },
});
