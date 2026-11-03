import {type ReactNode} from 'react';
import {StyleSheet, View} from 'react-native';
import {type Href, Link} from 'expo-router';
import {colors} from '@plan-for-myself/shared';
import {Lucide} from '@react-native-vector-icons/lucide';
import IconButton, {ICON_COLOR} from '@/shared/components/IconButton';
import Text from '@/shared/components/Text';
import {spacing, typography} from '@/shared/styles/design-tokens';

interface CalendarHeaderProps {
  title: string;
  previousHref: Href;
  nextHref: Href;
  menu: ReactNode;
  right?: ReactNode;
}

export default function CalendarHeader({title, previousHref, nextHref, menu, right}: CalendarHeaderProps) {
  return (
    <View style={styles.calendarHeader}>
      <View style={styles.menuSlot}>{menu}</View>
      <View style={styles.monthNavigation}>
        <Link asChild href={previousHref}>
          <IconButton icon={<Lucide color={ICON_COLOR} name="chevron-left" size={MONTH_ICON_SIZE} />} />
        </Link>
        <Text numberOfLines={1} style={styles.calendarTitle}>
          {title}
        </Text>
        <Link asChild href={nextHref}>
          <IconButton icon={<Lucide color={ICON_COLOR} name="chevron-right" size={MONTH_ICON_SIZE} />} />
        </Link>
      </View>
      <View style={styles.right}>{right}</View>
    </View>
  );
}

const MONTH_ICON_SIZE = 15;

const styles = StyleSheet.create({
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingTop: spacing.md,
    paddingHorizontal: spacing.pageXMobile,
  },
  menuSlot: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  monthNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  calendarTitle: {
    ...typography.h3,
    fontWeight: 'bold',
    color: colors.text,
  },
  right: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
});
