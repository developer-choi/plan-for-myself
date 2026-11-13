import {Pressable, StyleSheet, View} from 'react-native';
import {colors} from '@plan-for-myself/shared/color';
import {DEMO_CONTINUE_LABEL} from '@plan-for-myself/shared/demo';
import Button from '@/shared/components/Button';
import CloseIconButton from '@/shared/components/CloseIconButton';
import DialogFrame from '@/shared/components/DialogFrame';
import Text from '@/shared/components/Text';
import {spacing, typography} from '@/shared/styles/design-tokens';

interface DemoChoiceDialogFrameProps {
  isOpen: boolean;
  content: {
    title: string;
    description?: string[];
    actionLabel: string;
  };
  handlers: {
    onAction: () => void;
    onClose: () => void;
  };
}

export default function DemoChoiceDialogFrame({isOpen, content, handlers}: DemoChoiceDialogFrameProps) {
  const {title, description, actionLabel} = content;
  const {onAction, onClose} = handlers;

  return (
    <DialogFrame open={isOpen} onRequestClose={onClose}>
      <CloseIconButton style={styles.close} onPress={onClose} />
      <Text style={styles.title}>{title}</Text>
      {description === undefined ? null : (
        <View style={styles.description}>
          {description.map((sentence) => (
            <Text key={sentence} style={styles.sentence}>
              {sentence}
            </Text>
          ))}
        </View>
      )}
      <View style={styles.options}>
        <Button label={actionLabel} onPress={onAction} />
        <Pressable style={styles.continue} onPress={onClose}>
          <Text style={styles.continueLabel}>{DEMO_CONTINUE_LABEL}</Text>
        </Pressable>
      </View>
    </DialogFrame>
  );
}

const styles = StyleSheet.create({
  close: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    zIndex: 1,
  },
  title: {
    ...typography.body1,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
  },
  description: {
    marginTop: -spacing.sm,
    marginBottom: spacing.md,
  },
  sentence: {
    ...typography.body2,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  options: {
    rowGap: spacing.sm,
  },
  continue: {
    alignItems: 'center',
    padding: spacing.xs,
  },
  continueLabel: {
    ...typography.body2,
    color: colors.textSecondary,
    textDecorationLine: 'underline',
  },
});
