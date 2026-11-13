import {StyleSheet, useWindowDimensions, View} from 'react-native';
import {colors} from '@plan-for-myself/shared/color';
import {DEMO_TOUR_STEP_COUNT} from '@plan-for-myself/shared/demo';
import Button from '@/shared/components/Button';
import CloseIconButton from '@/shared/components/CloseIconButton';
import Text from '@/shared/components/Text';
import {controlHeight, radius, shadows, spacing, typography} from '@/shared/styles/design-tokens';

interface TourBubbleProps {
  number: number;
  content: string;
  primaryLabel: string;
  handlers: {
    onPrimary: () => void;
    onClose: () => void;
  };
}

export default function TourBubble({number, content, primaryLabel, handlers}: TourBubbleProps) {
  const {width: windowWidth} = useWindowDimensions();

  return (
    <View style={[styles.bubble, {width: Math.min(BUBBLE_MAX_WIDTH, windowWidth - 2 * spacing.md)}]}>
      <CloseIconButton style={styles.close} onPress={handlers.onClose} />
      <Text style={styles.text}>{content}</Text>
      <View style={styles.row}>
        <Text style={styles.count}>
          {number} / {DEMO_TOUR_STEP_COUNT}
        </Text>
        <Button label={primaryLabel} size="medium" onPress={handlers.onPrimary} />
      </View>
    </View>
  );
}

export const TOUR_BUBBLE_TWO_LINE_HEIGHT =
  2 * spacing.md + 2 * typography.body1.lineHeight + spacing.sm + controlHeight.md;

const BUBBLE_MAX_WIDTH = 358;

const styles = StyleSheet.create({
  bubble: {
    rowGap: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    boxShadow: shadows.hover,
  },
  close: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    zIndex: 1,
  },
  text: {
    ...typography.body1,
    paddingRight: spacing.lg,
    fontWeight: 'bold',
    color: colors.text,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  count: {
    ...typography.body3,
    color: colors.textMuted,
  },
});
