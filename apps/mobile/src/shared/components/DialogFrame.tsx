import {type PropsWithChildren} from 'react';
import {Modal, Pressable, StyleSheet, View} from 'react-native';
import {colors} from '@plan-for-myself/shared';
import Text from '@/shared/components/Text';
import {contentWidth, radius, shadows, spacing, typography} from '@/shared/styles/design-tokens';

interface DialogFrameProps extends PropsWithChildren {
  open: boolean;
  title: string;
  onRequestClose: () => void;
}

export default function DialogFrame({open, title, onRequestClose, children}: DialogFrameProps) {
  return (
    <Modal
      navigationBarTranslucent
      statusBarTranslucent
      transparent
      animationType="none"
      visible={open}
      onRequestClose={onRequestClose}
    >
      <Pressable style={[StyleSheet.absoluteFill, styles.backdrop]} onPress={onRequestClose} />
      <View pointerEvents="box-none" style={styles.center}>
        <View style={styles.paper}>
          <Text style={styles.title}>{title}</Text>
          {children}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: colors.backdrop,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  paper: {
    width: '100%',
    maxWidth: contentWidth.dialog,
    padding: spacing.md,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    boxShadow: shadows.dialog,
  },
  title: {
    ...typography.h4,
    marginBottom: spacing.md,
    color: colors.text,
    fontWeight: 'bold',
  },
});
