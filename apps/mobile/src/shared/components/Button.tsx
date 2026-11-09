import type {ReactNode} from 'react';
import {ActivityIndicator, Pressable, type StyleProp, StyleSheet, View, type ViewStyle} from 'react-native';
import {colors} from '@plan-for-myself/shared/color';
import Text from '@/shared/components/Text';
import {controlHeight, opacity, radius, spacing, touchTarget, typography} from '@/shared/styles/design-tokens';

interface ButtonProps {
  label: string;
  onPress: () => void | Promise<void>;
  color?: 'primary' | 'secondary' | 'destructive';
  variant?: 'contained' | 'outlined' | 'text';
  size?: 'small' | 'medium' | 'large' | 'xLarge';
  icon?: ReactNode;
  loading?: boolean;
  /** 없으면 막지 않는다 */
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export default function Button({
  label,
  onPress,
  color = 'primary',
  variant = 'contained',
  size = 'large',
  icon,
  loading = false,
  disabled = false,
  style,
}: ButtonProps) {
  const labelColor = LABEL_COLORS[variant][color];

  return (
    <Pressable
      disabled={loading || disabled}
      hitSlop={HIT_SLOPS[size]}
      style={({pressed}) => [
        styles.button,
        buttonSizes[size],
        buttonColors[variant][color],
        style,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
      onPress={onPress}
    >
      <View style={[styles.content, contentGaps[size], loading && styles.hidden]}>
        {icon}
        <Text style={[styles.label, labelSizes[size], {color: labelColor}]}>{label}</Text>
      </View>
      {loading && (
        <View style={[StyleSheet.absoluteFill, styles.spinnerWrapper]}>
          <ActivityIndicator color={labelColor} size="small" style={spinnerSizes[size]} />
        </View>
      )}
    </Pressable>
  );
}

const HIT_SLOPS = {
  small: Math.max(0, (touchTarget.min - controlHeight.sm) / 2),
  medium: Math.max(0, (touchTarget.min - controlHeight.md) / 2),
  large: Math.max(0, (touchTarget.min - controlHeight.lg) / 2),
  xLarge: Math.max(0, (touchTarget.min - controlHeight.xl) / 2),
};

const SMALL_INDICATOR_RING_SIZE = 16.8;
const SPINNER_SIZES = {small: 16, medium: 20, large: 24, xLarge: 28};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '100%',
  },
  label: {
    flexShrink: 1,
  },
  hidden: {
    opacity: 0,
  },
  spinnerWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: opacity.pressed,
  },
  disabled: {
    opacity: opacity.disabled,
  },
});

const buttonSizes = StyleSheet.create({
  small: {minHeight: controlHeight.sm, paddingHorizontal: spacing.sm, borderRadius: radius.sm},
  medium: {minHeight: controlHeight.md, paddingHorizontal: spacing.gridGap},
  large: {minHeight: controlHeight.lg, paddingHorizontal: spacing.md},
  xLarge: {minHeight: controlHeight.xl, paddingHorizontal: spacing.lg},
});

const contentGaps = StyleSheet.create({
  small: {columnGap: spacing.xs},
  medium: {columnGap: spacing.sm},
  large: {columnGap: spacing.gridGap},
  xLarge: {columnGap: spacing.gridGap},
});

const labelSizes = StyleSheet.create({
  small: typography.body3,
  medium: typography.body2,
  large: typography.body2,
  xLarge: typography.body1,
});

const spinnerSizes = StyleSheet.create({
  small: {transform: [{scale: SPINNER_SIZES.small / SMALL_INDICATOR_RING_SIZE}]},
  medium: {transform: [{scale: SPINNER_SIZES.medium / SMALL_INDICATOR_RING_SIZE}]},
  large: {transform: [{scale: SPINNER_SIZES.large / SMALL_INDICATOR_RING_SIZE}]},
  xLarge: {transform: [{scale: SPINNER_SIZES.xLarge / SMALL_INDICATOR_RING_SIZE}]},
});

const buttonColors = {
  contained: StyleSheet.create({
    primary: {backgroundColor: colors.primary},
    secondary: {backgroundColor: colors.off},
    destructive: {backgroundColor: colors.fail},
  }),
  outlined: StyleSheet.create({
    primary: {borderWidth: 1, borderColor: colors.primary},
    secondary: {borderWidth: 1, borderColor: colors.textSecondary},
    destructive: {borderWidth: 1, borderColor: colors.fail},
  }),
  text: StyleSheet.create({
    primary: {},
    secondary: {},
    destructive: {},
  }),
};

const LABEL_COLORS = {
  contained: {primary: colors.onPrimary, secondary: colors.text, destructive: colors.onPrimary},
  outlined: {primary: colors.primary, secondary: colors.textSecondary, destructive: colors.fail},
  text: {primary: colors.primary, secondary: colors.textSecondary, destructive: colors.fail},
};
