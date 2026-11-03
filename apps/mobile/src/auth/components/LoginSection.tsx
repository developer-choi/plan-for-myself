import {StyleSheet, View} from 'react-native';
import {colors, GOOGLE_LOGIN_LABEL, LOGIN_DESCRIPTION, START_RECORDING_LABEL} from '@plan-for-myself/shared';
import AuthScreenFrame, {authScreenStyles} from '@/auth/components/AuthScreenFrame';
import GoogleIcon from '@/auth/components/GoogleIcon';
import LoginFailedNotice from '@/auth/components/LoginFailedNotice';
import Button from '@/shared/components/Button';
import Logo from '@/shared/components/Logo';
import Text from '@/shared/components/Text';
import {spacing, typography} from '@/shared/styles/design-tokens';

interface LoginSectionProps {
  isFailed: boolean;
  isPending: boolean;
  handlers: {
    onSignIn: () => Promise<void>;
  };
}

export default function LoginSection({isFailed, isPending, handlers}: LoginSectionProps) {
  return (
    <AuthScreenFrame>
      <Logo size="large" />
      <View style={styles.text}>
        <Text style={authScreenStyles.title}>{START_RECORDING_LABEL}</Text>
        <Text style={styles.description}>{LOGIN_DESCRIPTION}</Text>
      </View>
      <View style={authScreenStyles.actions}>
        {isFailed && <LoginFailedNotice />}
        <Button
          color="secondary"
          icon={<GoogleIcon />}
          label={GOOGLE_LOGIN_LABEL}
          loading={isPending}
          size="xLarge"
          onPress={handlers.onSignIn}
        />
      </View>
    </AuthScreenFrame>
  );
}

const styles = StyleSheet.create({
  text: {
    gap: spacing.sm,
  },
  description: {
    ...typography.body1,
    textAlign: 'center',
    color: colors.textSecondary,
  },
});
