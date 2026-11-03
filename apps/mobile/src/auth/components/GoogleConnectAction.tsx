import {StyleSheet, View} from 'react-native';
import {colors, CONNECT_KEEPS_RECORDS_HINT, GOOGLE_CONNECT_LABEL} from '@plan-for-myself/shared';
import GoogleIcon from '@/auth/components/GoogleIcon';
import useGoogleConnect from '@/auth/useGoogleConnect';
import Button from '@/shared/components/Button';
import Text from '@/shared/components/Text';
import {spacing, typography} from '@/shared/styles/design-tokens';

export default function GoogleConnectAction() {
  const {
    isPending,
    handlers: {connectAndNavigate},
  } = useGoogleConnect();

  return (
    <View style={styles.action}>
      <Button
        color="secondary"
        icon={<GoogleIcon />}
        label={GOOGLE_CONNECT_LABEL}
        loading={isPending}
        size="xLarge"
        onPress={connectAndNavigate}
      />
      <Text style={styles.hint}>{CONNECT_KEEPS_RECORDS_HINT}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  action: {
    marginTop: spacing.md,
  },
  hint: {
    ...typography.body2,
    marginTop: spacing.sm,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
