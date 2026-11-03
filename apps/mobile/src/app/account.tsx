import {ScrollView, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ACCOUNT_LABEL, colors} from '@plan-for-myself/shared';
import {Lucide} from '@react-native-vector-icons/lucide';
import AccountSection from '@/auth/components/AccountSection';
import {ICON_COLOR} from '@/shared/components/IconButton';
import SubPageHeader from '@/shared/components/SubPageHeader';
import {spacing} from '@/shared/styles/design-tokens';

export default function AccountScreen() {
  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.shell}>
      <SubPageHeader exit={{href: '/', icon: CALENDAR_ICON}} title={ACCOUNT_LABEL} />
      <ScrollView contentContainerStyle={styles.body}>
        <AccountSection />
      </ScrollView>
    </SafeAreaView>
  );
}

const CALENDAR_ICON_SIZE = 24;
const CALENDAR_ICON = <Lucide color={ICON_COLOR} name="calendar" size={CALENDAR_ICON_SIZE} />;

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
