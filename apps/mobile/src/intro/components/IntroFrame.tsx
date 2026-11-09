import type {PropsWithChildren} from 'react';
import {StyleSheet, View} from 'react-native';
import {colors} from '@plan-for-myself/shared/color';
import {radius, spacing} from '@/shared/styles/design-tokens';

interface IntroFrameProps extends PropsWithChildren {
  onSubtleBand?: boolean;
}

export default function IntroFrame({onSubtleBand = false, children}: IntroFrameProps) {
  return (
    <View pointerEvents="none" style={onSubtleBand ? undefined : styles.frame}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    padding: spacing.sm,
    backgroundColor: colors.page,
    borderRadius: radius.lg,
  },
});
