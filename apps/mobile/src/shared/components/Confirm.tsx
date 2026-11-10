import {StyleSheet, View} from 'react-native';
import {colors} from '@plan-for-myself/shared';
import Button from '@/shared/components/Button';
import DialogFrame from '@/shared/components/DialogFrame';
import Text from '@/shared/components/Text';
import {spacing, typography} from '@/shared/styles/design-tokens';

interface ConfirmProps {
  open: boolean;
  title: string;
  content: string;
  confirmLabel: string;
  loading: boolean;
  handlers: {
    onCancel: () => void;
    onConfirm: () => void | Promise<void>;
  };
}

export default function Confirm({open, title, content, confirmLabel, loading, handlers}: ConfirmProps) {
  const cancelUnlessLoading = () => {
    if (!loading) {
      handlers.onCancel();
    }
  };

  return (
    <DialogFrame open={open} title={title} onRequestClose={cancelUnlessLoading}>
      <Text style={styles.content}>{content}</Text>
      <View style={styles.actions}>
        <Button
          color="secondary"
          disabled={loading}
          label={CANCEL_LABEL}
          style={styles.action}
          onPress={handlers.onCancel}
        />
        <Button
          color="destructive"
          label={confirmLabel}
          loading={loading}
          style={styles.action}
          onPress={handlers.onConfirm}
        />
      </View>
    </DialogFrame>
  );
}

const CANCEL_LABEL = '취소';

const styles = StyleSheet.create({
  content: {
    ...typography.body2,
    marginBottom: spacing.lg,
    color: colors.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  action: {
    flex: 1,
  },
});
