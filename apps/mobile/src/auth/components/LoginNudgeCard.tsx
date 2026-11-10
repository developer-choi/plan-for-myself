import {StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {colors, GOOGLE_CONNECT_LABEL} from '@plan-for-myself/shared';
import {useLoginNudge} from '@plan-for-myself/shared/react';
import {appLoginNudgeStore} from '@/auth/login-nudge-store';
import useGoogleConnect from '@/auth/useGoogleConnect';
import Button from '@/shared/components/Button';
import CloseIconButton from '@/shared/components/CloseIconButton';
import Text from '@/shared/components/Text';
import {radius, shadows, spacing, typography} from '@/shared/styles/design-tokens';

interface LoginNudgeCardProps {
  today: string;
  recordedDays: number;
}

export default function LoginNudgeCard({today, recordedDays}: LoginNudgeCardProps) {
  const loginNudge = useLoginNudge(today, recordedDays, appLoginNudgeStore);
  const {
    isPending,
    handlers: {connectAndNavigate},
  } = useGoogleConnect();
  const insets = useSafeAreaInsets();

  if (!loginNudge.visible) {
    return null;
  }

  return (
    <View style={[styles.card, {bottom: insets.bottom + spacing.md}]}>
      <Text style={styles.message}>
        Google 계정을 연결하지 않으면 기기를 바꾸거나 앱을 지울 때 지금 기록을 다시 볼 수 없어요
      </Text>
      <Button
        label={GOOGLE_CONNECT_LABEL}
        loading={isPending}
        size="small"
        variant="outlined"
        onPress={connectAndNavigate}
      />
      <CloseIconButton style={styles.close} onPress={loginNudge.dismiss} />
    </View>
  );
}

const CLOSE_SIZE = 40;

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    right: spacing.md,
    left: spacing.md,
    gap: spacing.sm,
    alignItems: 'flex-start',
    paddingVertical: spacing.md,
    paddingLeft: spacing.md,
    paddingRight: CLOSE_SIZE,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    boxShadow: shadows.card,
  },
  message: {
    ...typography.body2,
    color: colors.text,
  },
  close: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: CLOSE_SIZE,
    height: CLOSE_SIZE,
  },
});
