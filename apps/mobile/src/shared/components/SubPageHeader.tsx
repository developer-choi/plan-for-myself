import {type ReactNode} from 'react';
import {StyleSheet, View} from 'react-native';
import {type Href, Link} from 'expo-router';
import {colors} from '@plan-for-myself/shared';
import {Lucide} from '@react-native-vector-icons/lucide';
import IconButton, {ICON_COLOR} from '@/shared/components/IconButton';
import Text from '@/shared/components/Text';
import {spacing, typography} from '@/shared/styles/design-tokens';

interface SubPageHeaderProps {
  title: string;
  exit: SubPageHeaderExit;
  monthNavigation: SubPageMonthNavigation;
}

interface SubPageHeaderExit {
  href: Href;
  icon: ReactNode;
}

interface SubPageMonthNavigation {
  /* 첫 기록이 있는 달이거나 첫 기록 날짜를 아직 모르면 비운다 */
  previousHref?: Href;
  /* 이번 달이거나 첫 기록 날짜를 아직 모르면 비운다 */
  nextHref?: Href;
}

interface MonthLinkProps {
  /* 그 쪽으로 갈 수 없으면 undefined */
  href: Href | undefined;
  testID: string;
  icon: ReactNode;
}

export default function SubPageHeader({title, exit, monthNavigation}: SubPageHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.side}>
        <Link asChild href={exit.href}>
          <IconButton icon={exit.icon} />
        </Link>
      </View>
      <View style={styles.monthNavigation}>
        <MonthLink href={monthNavigation.previousHref} icon={PREVIOUS_ICON} testID={PREVIOUS_MONTH_LINK_TEST_ID} />
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>
        <MonthLink href={monthNavigation.nextHref} icon={NEXT_ICON} testID={NEXT_MONTH_LINK_TEST_ID} />
      </View>
      <View style={styles.side} />
    </View>
  );
}

export const PREVIOUS_MONTH_LINK_TEST_ID = 'previous-month-link';
export const NEXT_MONTH_LINK_TEST_ID = 'next-month-link';

const MONTH_ICON_SIZE = 15;
const PREVIOUS_ICON = <Lucide color={ICON_COLOR} name="chevron-left" size={MONTH_ICON_SIZE} />;
const NEXT_ICON = <Lucide color={ICON_COLOR} name="chevron-right" size={MONTH_ICON_SIZE} />;
const HEADER_HEIGHT = 56;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    height: HEADER_HEIGHT,
    paddingHorizontal: spacing.pageXMobile,
    backgroundColor: colors.page,
  },
  side: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  monthNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  title: {
    ...typography.h4,
    fontWeight: 'bold',
    color: colors.text,
  },
  hiddenMonthLink: {
    opacity: 0,
  },
});

function MonthLink({href, testID, icon}: MonthLinkProps) {
  if (href === undefined) {
    return <IconButton disabled icon={icon} style={styles.hiddenMonthLink} />;
  }

  return (
    <Link asChild href={href}>
      <IconButton icon={icon} testID={testID} />
    </Link>
  );
}
