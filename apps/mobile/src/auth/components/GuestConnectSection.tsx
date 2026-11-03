import {Pressable, View} from 'react-native';
import {
  GOOGLE_CONNECT_LABEL,
  GOOGLE_CONNECT_PAGE_LABEL,
  KEEP_GUEST_LABEL,
  type LoginFailure,
  MY_CALENDAR_LABEL,
} from '@plan-for-myself/shared';
import AuthScreenFrame, {authScreenStyles} from '@/auth/components/AuthScreenFrame';
import DiscardGuestButton from '@/auth/components/DiscardGuestButton';
import GoogleIcon from '@/auth/components/GoogleIcon';
import LoginFailedNotice from '@/auth/components/LoginFailedNotice';
import RegisteredAccountNotice from '@/auth/components/RegisteredAccountNotice';
import Button from '@/shared/components/Button';
import Logo from '@/shared/components/Logo';
import Text from '@/shared/components/Text';

interface GuestConnectSectionProps {
  isRejected: boolean;
  isPending: boolean;
  failure: LoginFailure | null;
  handlers: {
    onConnect: () => void;
    onDiscard: () => Promise<void>;
    onLeave: () => void;
  };
}

export default function GuestConnectSection({isRejected, isPending, failure, handlers}: GuestConnectSectionProps) {
  return (
    <AuthScreenFrame>
      <Pressable onPress={handlers.onLeave}>
        <Logo size="large" />
      </Pressable>
      <Text style={authScreenStyles.title}>{GOOGLE_CONNECT_PAGE_LABEL}</Text>
      <View style={authScreenStyles.actions}>
        {isRejected && failure === null && <RegisteredAccountNotice />}
        {failure === 'failed' && <LoginFailedNotice />}
        {isRejected ? (
          <>
            <DiscardGuestButton onConfirm={handlers.onDiscard} />
            <Button color="secondary" label={KEEP_GUEST_LABEL} size="xLarge" onPress={handlers.onLeave} />
          </>
        ) : (
          <Button
            color="secondary"
            icon={<GoogleIcon />}
            label={GOOGLE_CONNECT_LABEL}
            loading={isPending}
            size="xLarge"
            onPress={handlers.onConnect}
          />
        )}
      </View>
      {!isRejected && (
        <Pressable style={authScreenStyles.exitLink} onPress={handlers.onLeave}>
          <Text style={authScreenStyles.exitLabel}>{MY_CALENDAR_LABEL}</Text>
        </Pressable>
      )}
    </AuthScreenFrame>
  );
}
