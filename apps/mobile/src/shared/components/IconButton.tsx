import {type ReactNode} from 'react';
import {Pressable, type PressableProps, type StyleProp, StyleSheet, type ViewStyle} from 'react-native';
import {colors} from '@plan-for-myself/shared/color';
import {radius, spacing} from '@/shared/styles/design-tokens';

interface IconButtonProps extends Omit<PressableProps, 'children' | 'style'> {
  icon: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export default function IconButton({icon, style, ...rest}: IconButtonProps) {
  return (
    <Pressable hitSlop={HIT_SLOP} style={[styles.button, style]} {...rest}>
      {icon}
    </Pressable>
  );
}

export const ICON_COLOR = colors.textSecondary;

const HIT_SLOP = 13;

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xs,
    borderRadius: radius.full,
  },
});
