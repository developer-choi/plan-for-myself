import {useRef} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Redirect} from 'expo-router';
import {type CalendarMonth, toMonthParam} from '@plan-for-myself/shared/date';
import {DEMO_HOME_URL} from '@plan-for-myself/shared/demo';
import {isSameMonth} from '@plan-for-myself/shared/study-record';
import {useSuspenseQuery} from '@tanstack/react-query';
import DemoStatsSection from '@/demo/components/DemoStatsSection';
import {demoQueries} from '@/demo/queries';
import {spacing} from '@/shared/styles/design-tokens';

interface FetchedDemoStatsProps {
  month: CalendarMonth;
}

export default function FetchedDemoStats({month}: FetchedDemoStatsProps) {
  const {
    data: {today, records, overview, monthly},
  } = useSuspenseQuery(demoQueries.month.options(toMonthParam(month)));
  const scrollViewRef = useRef<ScrollView>(null);

  if (monthly === null) {
    return <Redirect href={DEMO_HOME_URL} />;
  }

  return (
    <ScrollView ref={scrollViewRef} contentContainerStyle={styles.body}>
      <DemoStatsSection
        month={month}
        monthly={monthly}
        overview={isSameMonth(today, month) ? overview : null}
        records={records}
        scrollViewRef={scrollViewRef}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  body: {
    flexGrow: 1,
    paddingHorizontal: spacing.pageXMobile,
    paddingBottom: spacing.xxl,
  },
});
