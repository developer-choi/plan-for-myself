import {StyleSheet} from 'react-native';
import {colors, GUEST_ACCOUNT_TITLE, GUEST_DELETE_TEXT} from '@plan-for-myself/shared';
import AccountDeleteAction from '@/auth/components/AccountDeleteAction';
import GoogleConnectAction from '@/auth/components/GoogleConnectAction';
import Card from '@/shared/components/Card';
import Text from '@/shared/components/Text';
import {spacing, typography} from '@/shared/styles/design-tokens';

export default function GuestAccount() {
  return (
    <>
      <Card>
        <Text style={styles.title}>{GUEST_ACCOUNT_TITLE}</Text>
        <Text style={styles.sub}>기기를 바꾸거나 앱을 지울 때 지금 기록을 다시 볼 수 없어요</Text>
        <GoogleConnectAction />
      </Card>
      <AccountDeleteAction text={GUEST_DELETE_TEXT} />
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    ...typography.body1,
    fontWeight: 'bold',
    color: colors.text,
  },
  sub: {
    ...typography.body2,
    marginTop: spacing.sm,
    color: colors.textSecondary,
  },
});
