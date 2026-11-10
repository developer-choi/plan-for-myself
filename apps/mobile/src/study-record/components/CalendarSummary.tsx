import {Pressable, StyleSheet, View} from 'react-native';
import {type Href, Link} from 'expo-router';
import {colors, STATS_LABEL} from '@plan-for-myself/shared';
import {Lucide} from '@react-native-vector-icons/lucide';
import Text from '@/shared/components/Text';
import {controlHeight, opacity, radius, spacing, touchTarget, typography} from '@/shared/styles/design-tokens';

interface CalendarSummaryProps {
  statsHref?: Href;
}

export default function CalendarSummary({statsHref}: CalendarSummaryProps) {
  return (
    <View style={styles.summary}>
      {statsHref !== undefined && (
        <Link asChild href={statsHref}>
          {/* Link asChild가 Pressable의 함수 style을 버려서, children 함수로 눌림 상태를 받아 안쪽 View에 건다 */}
          <Pressable hitSlop={STATS_HIT_SLOP}>
            {({pressed}) => (
              <View style={[styles.statsButton, pressed && styles.pressed]}>
                <Lucide color={colors.textSecondary} name="bar-chart" size={STATS_ICON_SIZE} />
                <Text style={styles.statsLabel}>{STATS_LABEL}</Text>
              </View>
            )}
          </Pressable>
        </Link>
      )}
    </View>
  );
}

const STATS_ICON_SIZE = 15;
const STATS_HIT_SLOP = (touchTarget.min - controlHeight.sm) / 2;

const styles = StyleSheet.create({
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: controlHeight.sm,
    marginVertical: spacing.sm,
    marginHorizontal: spacing.xs,
  },
  statsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: spacing.xs,
    height: controlHeight.sm,
    paddingHorizontal: spacing.sm,
    borderWidth: 1,
    borderColor: colors.textSecondary,
    borderRadius: radius.sm,
  },
  statsLabel: {
    ...typography.body3,
    color: colors.textSecondary,
  },
  pressed: {
    opacity: opacity.pressed,
  },
});
