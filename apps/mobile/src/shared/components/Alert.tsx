import {StyleSheet} from 'react-native';
import {colors} from '@plan-for-myself/shared';
import Button from '@/shared/components/Button';
import DialogFrame from '@/shared/components/DialogFrame';
import Text from '@/shared/components/Text';
import {spacing, typography} from '@/shared/styles/design-tokens';

interface AlertProps {
  open: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

export default function Alert({open, onClose, title, content}: AlertProps) {
  return (
    <DialogFrame open={open} title={title} onRequestClose={onClose}>
      <Text style={styles.content}>{content}</Text>
      <Button label={CONFIRM_LABEL} onPress={onClose} />
    </DialogFrame>
  );
}

const CONFIRM_LABEL = '확인';

const styles = StyleSheet.create({
  content: {
    ...typography.body2,
    marginBottom: spacing.lg,
    color: colors.textSecondary,
  },
});
