import type {PropsWithChildren} from 'react';
import {type StyleProp, StyleSheet, View, type ViewStyle} from 'react-native';
import {colors} from '@plan-for-myself/shared';
import {contentWidth, spacing} from '@/shared/styles/design-tokens';

interface IntroSectionProps extends PropsWithChildren {
  onSubtleBand?: boolean;
  style?: StyleProp<ViewStyle>;
}

export default function IntroSection({onSubtleBand = false, style, children}: IntroSectionProps) {
  return (
    <View style={onSubtleBand ? styles.subtleBand : undefined}>
      <View style={[styles.section, style]}>{children}</View>
    </View>
  );
}

const SECTION_PADDING_Y = 96;

const styles = StyleSheet.create({
  subtleBand: {
    backgroundColor: colors.page,
  },
  section: {
    gap: spacing.lg,
    alignSelf: 'center',
    width: '100%',
    maxWidth: contentWidth.narrow + 2 * spacing.pageXMobile,
    paddingVertical: SECTION_PADDING_Y,
    paddingHorizontal: spacing.pageXMobile,
  },
});
