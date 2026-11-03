import {StyleSheet, View} from 'react-native';
import {colors, DEMO_BANNER_MESSAGE, MY_CALENDAR_LABEL, START_RECORDING_LABEL} from '@plan-for-myself/shared';
import {useSession} from '@/auth/session-context';
import Button from '@/shared/components/Button';
import Text from '@/shared/components/Text';
import {spacing, typography} from '@/shared/styles/design-tokens';
import {resetStackTo} from '@/shared/reset-stack';

export default function DemoBanner() {
  const {session} = useSession();
  const isLoggedIn = session.token !== null;

  return (
    <View style={styles.banner}>
      <Text style={styles.text}>{DEMO_BANNER_MESSAGE}</Text>
      <Button
        label={isLoggedIn ? MY_CALENDAR_LABEL : START_RECORDING_LABEL}
        size="medium"
        onPress={() => resetStackTo(isLoggedIn ? '/' : '/sign-in')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.primarySoft,
  },
  text: {
    ...typography.body2,
    flexShrink: 1,
    fontWeight: 'bold',
    color: colors.primary,
  },
});
