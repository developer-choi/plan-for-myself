import {type PropsWithChildren} from 'react';
import {StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors} from '@plan-for-myself/shared';
import {contentWidth, spacing, typography} from '@/shared/styles/design-tokens';

export default function AuthScreenFrame({children}: PropsWithChildren) {
  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.content}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.pageXMobile,
  },
  content: {
    width: '100%',
    maxWidth: contentWidth.narrow,
    gap: spacing.xl,
    alignItems: 'center',
  },
});

export const authScreenStyles = StyleSheet.create({
  title: {
    ...typography.h2,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.text,
  },
  actions: {
    width: '100%',
    gap: spacing.sm,
  },
  exitLink: {
    padding: spacing.xs,
  },
  exitLabel: {
    ...typography.body2,
    color: colors.textSecondary,
    textDecorationLine: 'underline',
  },
});
