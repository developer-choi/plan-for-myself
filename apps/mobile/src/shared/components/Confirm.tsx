import {StyleSheet, View} from 'react-native';
import {colors} from '@plan-for-myself/shared/color';
import Button from '@/shared/components/Button';
import DialogFrame from '@/shared/components/DialogFrame';
import Text from '@/shared/components/Text';
import {radius, spacing, typography} from '@/shared/styles/design-tokens';

interface ConfirmProps {
  open: boolean;
  title: string;
  content: string;
  confirmLabel: string;
  loading: boolean;
  failure?: string;
  handlers: {
    onCancel: () => void;
    onConfirm: () => void | Promise<void>;
  };
}

export default function Confirm({open, title, content, confirmLabel, loading, failure, handlers}: ConfirmProps) {
  const cancelUnlessLoading = () => {
    if (!loading) {
      handlers.onCancel();
    }
  };

  return (
    <DialogFrame open={open} title={title} onRequestClose={cancelUnlessLoading}>
      <View style={styles.body}>
        <Text style={styles.content}>{content}</Text>
        {failure !== undefined && <Text style={styles.failure}>{failure}</Text>}
      </View>
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
  body: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  content: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  failure: {
    ...typography.body2,
    padding: spacing.gridGap,
    borderRadius: radius.sm,
    overflow: 'hidden',
    color: colors.fail,
    backgroundColor: colors.failSoft,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  action: {
    flex: 1,
  },
});
