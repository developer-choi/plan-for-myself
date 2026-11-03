import type {PropsWithChildren} from 'react';
import {StyleSheet, View} from 'react-native';
import {spacing} from '@/shared/styles/design-tokens';

export default function IntroActions({children}: PropsWithChildren) {
  return <View style={styles.actions}>{children}</View>;
}

const styles = StyleSheet.create({
  actions: {
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
});
