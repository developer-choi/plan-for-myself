import {StyleSheet} from 'react-native';
import {Redirect, useLocalSearchParams} from 'expo-router';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors, formatMonthTitle, monthPath, parseMonth, shiftMonth} from '@plan-for-myself/shared';
import CalendarHeader from '@/study-record/components/CalendarHeader';
import CalendarMenu from '@/study-record/components/CalendarMenu';

export default function CalendarScreen() {
  const viewMonth = parseMonth(useLocalSearchParams<{year: string; month: string}>());

  if (!viewMonth) {
    return <Redirect href="/" />;
  }

  return (
    <SafeAreaView edges={['top']} style={styles.shell}>
      <CalendarHeader
        menu={<CalendarMenu />}
        nextHref={monthPath(shiftMonth(viewMonth, 1))}
        previousHref={monthPath(shiftMonth(viewMonth, -1))}
        title={formatMonthTitle(viewMonth)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    backgroundColor: colors.page,
  },
});
