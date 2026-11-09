import {Suspense} from 'react';
import {StyleSheet, View} from 'react-native';
import {Redirect, useLocalSearchParams} from 'expo-router';
import {SafeAreaView} from 'react-native-safe-area-context';
import FetchedLoginNudgeCard from '@/auth/components/FetchedLoginNudgeCard';
import {useSession} from '@/auth/session-context';
import {colors} from '@plan-for-myself/shared/color';
import {formatMonthTitle, parseMonth, shiftMonth} from '@plan-for-myself/shared/date';
import {monthPath} from '@plan-for-myself/shared/study-record';
import HandledErrorBoundary from '@/shared/components/HandledErrorBoundary';
import LoadingSpinner from '@/shared/components/LoadingSpinner';
import useKoreanToday from '@/shared/hooks/useKoreanToday';
import {spacing} from '@/shared/styles/design-tokens';
import CalendarHeader from '@/study-record/components/CalendarHeader';
import CalendarMenu from '@/study-record/components/CalendarMenu';
import FetchedCalendarSection from '@/study-record/components/FetchedCalendarSection';
import GoogleConnectLink from '@/study-record/components/GoogleConnectLink';
import GuestCalendarMenu from '@/study-record/components/GuestCalendarMenu';

export default function CalendarScreen() {
  const viewMonth = parseMonth(useLocalSearchParams<{year: string; month: string}>());
  const today = useKoreanToday();
  const {
    session: {isGuest},
  } = useSession();

  if (!viewMonth) {
    return <Redirect href="/" />;
  }

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.shell}>
      <CalendarHeader
        menu={isGuest ? <GuestCalendarMenu /> : <CalendarMenu />}
        nextHref={monthPath(shiftMonth(viewMonth, 1))}
        previousHref={monthPath(shiftMonth(viewMonth, -1))}
        right={isGuest ? <GoogleConnectLink /> : undefined}
        title={formatMonthTitle(viewMonth)}
      />
      <View style={styles.body}>
        <HandledErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <FetchedCalendarSection month={viewMonth} today={today} />
          </Suspense>
        </HandledErrorBoundary>
      </View>
      {isGuest && <FetchedLoginNudgeCard today={today} />}
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
