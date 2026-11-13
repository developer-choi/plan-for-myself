import {Pressable, StyleSheet, View} from 'react-native';
import {colors} from '@plan-for-myself/shared/color';
import {
  GOOGLE_LOGIN_LABEL,
  GUEST_CONNECT_NOTE,
  GUEST_START_LABEL,
  INTRO_EXIT_LABEL,
  LOGIN_DESCRIPTION,
  type LoginFailure,
} from '@plan-for-myself/shared/auth';
import {START_RECORDING_LABEL} from '@plan-for-myself/shared/label';
import AuthScreenFrame, {authScreenStyles} from '@/auth/components/AuthScreenFrame';
import GoogleIcon from '@/auth/components/GoogleIcon';
import GuestLimitNotice from '@/auth/components/GuestLimitNotice';
import LoginFailedNotice from '@/auth/components/LoginFailedNotice';
import Button from '@/shared/components/Button';
import Logo from '@/shared/components/Logo';
import Text from '@/shared/components/Text';
import {opacity, spacing, touchTarget, typography} from '@/shared/styles/design-tokens';

export type PendingAction = 'google' | 'guest';

interface LoginSectionProps {
  failure: LoginFailure | null;
  pendingAction: PendingAction | null;
  handlers: {
    onSignIn: () => Promise<void>;
    onStartAsGuest: () => Promise<void>;
    onExit: () => void;
  };
}

export default function LoginSection({failure, pendingAction, handlers}: LoginSectionProps) {
  return (
    <AuthScreenFrame>
      <Pressable disabled={pendingAction !== null} onPress={handlers.onExit}>
        <Logo size="large" />
      </Pressable>
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
      <Pressable
        disabled={pendingAction !== null}
        hitSlop={EXIT_LINK_HIT_SLOP}
        style={({pressed}) => [
          authScreenStyles.exitLink,
          pendingAction !== null && styles.exitLinkDisabled,
          pressed && styles.pressed,
        ]}
        onPress={handlers.onExit}
      >
        <Text style={authScreenStyles.exitLabel}>{INTRO_EXIT_LABEL}</Text>
      </Pressable>
    </AuthScreenFrame>
  );
}

const GUEST_DEVICE_NOTE = '이 기기에서만 쓸 수 있어요.';

const EXIT_LINK_HIT_SLOP = (touchTarget.min - typography.body2.lineHeight - 2 * spacing.xs) / 2;

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
  exitLinkDisabled: {
    opacity: opacity.disabled,
  },
  pressed: {
    opacity: opacity.pressed,
  },
});
