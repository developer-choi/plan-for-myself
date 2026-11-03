import {StyleSheet, View} from 'react-native';
import {
  colors,
  GOOGLE_LOGIN_LABEL,
  GUEST_CONNECT_NOTE,
  GUEST_START_LABEL,
  LOGIN_DESCRIPTION,
  type LoginFailure,
  START_RECORDING_LABEL,
} from '@plan-for-myself/shared';
import AuthScreenFrame, {authScreenStyles} from '@/auth/components/AuthScreenFrame';
import GoogleIcon from '@/auth/components/GoogleIcon';
import GuestLimitNotice from '@/auth/components/GuestLimitNotice';
import LoginFailedNotice from '@/auth/components/LoginFailedNotice';
import Button from '@/shared/components/Button';
import Logo from '@/shared/components/Logo';
import Text from '@/shared/components/Text';
import {spacing, typography} from '@/shared/styles/design-tokens';

export type PendingAction = 'google' | 'guest';

interface LoginSectionProps {
  failure: LoginFailure | null;
  pendingAction: PendingAction | null;
  handlers: {
    onSignIn: () => Promise<void>;
    onStartAsGuest: () => Promise<void>;
  };
}

export default function LoginSection({failure, pendingAction, handlers}: LoginSectionProps) {
  return (
    <AuthScreenFrame>
      <Logo size="large" />
      <View style={styles.text}>
        <Text style={authScreenStyles.title}>{START_RECORDING_LABEL}</Text>
        <Text style={styles.description}>{LOGIN_DESCRIPTION}</Text>
      </View>
      <View style={authScreenStyles.actions}>
        {failure === 'guest-limit' && <GuestLimitNotice />}
        {failure === 'failed' && <LoginFailedNotice />}
        <Button
          color="secondary"
          disabled={pendingAction === 'guest'}
          icon={<GoogleIcon />}
          label={GOOGLE_LOGIN_LABEL}
          loading={pendingAction === 'google'}
          size="xLarge"
          onPress={handlers.onSignIn}
        />
        <View style={styles.guest}>
          <Button
            color="secondary"
            disabled={pendingAction === 'google'}
            label={GUEST_START_LABEL}
            loading={pendingAction === 'guest'}
            size="xLarge"
            variant="outlined"
            onPress={handlers.onStartAsGuest}
          />
          <View>
            <Text style={styles.guestNote}>{GUEST_DEVICE_NOTE}</Text>
            <Text style={styles.guestNote}>{GUEST_CONNECT_NOTE}</Text>
          </View>
        </View>
      </View>
    </AuthScreenFrame>
  );
}

const GUEST_DEVICE_NOTE = '이 기기에서만 쓸 수 있어요.';

const styles = StyleSheet.create({
  text: {
    gap: spacing.sm,
  },
  description: {
    ...typography.body1,
    textAlign: 'center',
    color: colors.textSecondary,
  },
  guest: {
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  guestNote: {
    ...typography.body2,
    textAlign: 'center',
    color: colors.textSecondary,
  },
});
