import type {ReactNode} from 'react';
import {
  colors,
  type FailureTag,
  type FailureTagSelection,
  filterByStatus,
  formatAppearedNotePrefix,
  formatFailCardTitle,
  formatFailEmptyTitle,
  formatReducedGroupTitle,
  formatReducedNotePrefix,
  formatRepeatedNotePrefix,
  STATS_TEXT,
  type StudyRecordMonthly,
} from '@plan-for-myself/shared';
import {Lucide} from '@react-native-vector-icons/lucide';
import {type Insets, Pressable, StyleSheet, View} from 'react-native';
import Card from '@/shared/components/Card';
import Text from '@/shared/components/Text';
import {fontSize, opacity, radius, spacing, touchTarget, typography} from '@/shared/styles/design-tokens';

interface FailCardProps {
  monthly: StudyRecordMonthly;
  selection: FailureTagSelection;
}

interface GroupProps {
  title: string;
  icon: ReactNode;
  tone: 'fail' | 'success';
  tags: FailureTag[];
  hasDividerAbove: boolean;
  children: (tag: FailureTag, hitSlop: Insets) => ReactNode;
}

interface TagRowProps {
  name: string;
  selection: FailureTagSelection;
  hitSlop: Insets;
  children: ReactNode;
}

export default function FailCard({monthly, selection}: FailCardProps) {
  const {failureTags, inProgress} = monthly;
  const hasNoFailure = failureTags.length === 0;
  const repeatedTags = filterByStatus(failureTags, 'repeated');
  const appearedTags = filterByStatus(failureTags, 'appeared');
  const reducedTags = filterByStatus(failureTags, 'reduced');
  const hasRepeated = repeatedTags.length > 0;
  const hasRepeatedOrAppeared = hasRepeated || appearedTags.length > 0;

  return (
    <Card title={formatFailCardTitle(monthly.month)}>
      {hasNoFailure ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>{formatFailEmptyTitle(monthly.month)}</Text>
          <Text style={styles.emptySub}>{STATS_TEXT.failEmptyHint}</Text>
        </View>
      ) : (
        <View>
          <Group
            hasDividerAbove={false}
            icon={FAIL_ICON}
            tags={repeatedTags}
            title={STATS_TEXT.repeatedGroupTitle}
            tone="fail"
          >
            {(tag, hitSlop) => (
              <TagRow hitSlop={hitSlop} name={tag.tag} selection={selection}>
                {formatRepeatedNotePrefix(tag.previousCount, inProgress)}
                <Text style={styles.countFail}>{tag.count}번</Text>
              </TagRow>
            )}
          </Group>
          <Group
            hasDividerAbove={hasRepeated}
            icon={FAIL_ICON}
            tags={appearedTags}
            title={STATS_TEXT.appearedGroupTitle}
            tone="fail"
          >
            {(tag, hitSlop) => (
              <TagRow hitSlop={hitSlop} name={tag.tag} selection={selection}>
                {formatAppearedNotePrefix(monthly.month, inProgress)}
                <Text style={styles.countFail}>{tag.count}번</Text>
              </TagRow>
            )}
          </Group>
          <Group
            hasDividerAbove={hasRepeatedOrAppeared}
            icon={SUCCESS_ICON}
            tags={reducedTags}
            title={formatReducedGroupTitle(inProgress)}
            tone="success"
          >
            {(tag, hitSlop) => (
              <TagRow hitSlop={hitSlop} name={tag.tag} selection={selection}>
                {formatReducedNotePrefix(tag.previousCount)}
                <Text style={styles.countSuccess}>{tag.count}번</Text>
              </TagRow>
            )}
          </Group>
        </View>
      )}
    </Card>
  );
}

export const TAG_ROW_TEST_ID_PREFIX = 'fail-tag-row-';

const GROUP_ICON_SIZE = 10;
const GROUP_ICON_DIAMETER = 16;
const FAIL_ICON = <Lucide color={colors.onPrimary} name="x" size={GROUP_ICON_SIZE} />;
const SUCCESS_ICON = <Lucide color={colors.onPrimary} name="check" size={GROUP_ICON_SIZE} />;
const TAG_ROW_VERTICAL_SLOP = (touchTarget.min - typography.body2.lineHeight - 2 * spacing.sm) / 2;

const styles = StyleSheet.create({
  empty: {
    gap: spacing.xs,
  },
  emptyTitle: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  emptySub: {
    ...typography.body3,
    color: colors.textMuted,
  },
  groupDivided: {
    marginTop: spacing.sm,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  groupIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: GROUP_ICON_DIAMETER,
    height: GROUP_ICON_DIAMETER,
    borderRadius: GROUP_ICON_DIAMETER / 2,
  },
  groupTitle: {
    ...typography.body3,
    fontWeight: 'bold',
  },
  toneFailBackground: {
    backgroundColor: colors.fail,
  },
  toneSuccessBackground: {
    backgroundColor: colors.success,
  },
  toneFailText: {
    color: colors.fail,
  },
  toneSuccessText: {
    color: colors.success,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.sm,
    marginHorizontal: -spacing.sm,
    borderRadius: radius.sm,
  },
  tagRowSelected: {
    backgroundColor: colors.failSoft,
  },
  pressed: {
    opacity: opacity.pressed,
  },
  selectedText: {
    fontWeight: 'bold',
  },
  moreSelected: {
    color: colors.fail,
  },
  tagName: {
    ...typography.body2,
    width: 90,
    color: colors.text,
  },
  tagText: {
    ...typography.body2,
    flex: 1,
    fontSize: fontSize.base,
    color: colors.textSecondary,
  },
  more: {
    ...typography.body2,
    width: 48,
    fontSize: fontSize.sm,
    color: colors.textMuted,
    textAlign: 'right',
  },
  countFail: {
    fontWeight: 'bold',
    color: colors.fail,
  },
  countSuccess: {
    fontWeight: 'bold',
    color: colors.success,
  },
});

function Group({title, icon, tone, tags, hasDividerAbove, children}: GroupProps) {
  if (tags.length === 0) {
    return null;
  }

  return (
    <View style={hasDividerAbove ? styles.groupDivided : undefined}>
      <View style={styles.groupHeader}>
        <View style={[styles.groupIcon, tone === 'fail' ? styles.toneFailBackground : styles.toneSuccessBackground]}>
          {icon}
        </View>
        <Text style={[styles.groupTitle, tone === 'fail' ? styles.toneFailText : styles.toneSuccessText]}>{title}</Text>
      </View>
      {tags.map((tag, index) => (
        <View key={tag.tag}>
          {/* 이웃 줄과 겹치면 뒤 줄이 앞 줄의 터치를 가져가서 묶음 바깥쪽에만 넓힌다 */}
          {children(tag, {
            top: index === 0 ? TAG_ROW_VERTICAL_SLOP : 0,
            bottom: index === tags.length - 1 ? TAG_ROW_VERTICAL_SLOP : 0,
          })}
        </View>
      ))}
    </View>
  );
}

function TagRow({name, selection, hitSlop, children}: TagRowProps) {
  const selected = selection.selectedTag === name;

  return (
    <Pressable
      hitSlop={hitSlop}
      style={({pressed}) => [styles.tagRow, selected && styles.tagRowSelected, pressed && styles.pressed]}
      testID={`${TAG_ROW_TEST_ID_PREFIX}${name}`}
      onPress={() => selection.onSelect(name)}
    >
      <Text numberOfLines={1} style={[styles.tagName, selected && styles.selectedText]}>
        {name}
      </Text>
      <Text numberOfLines={1} style={[styles.tagText, selected && styles.selectedText]}>
        {children}
      </Text>
      <Text style={[styles.more, selected && styles.selectedText, selected && styles.moreSelected]}>
        {STATS_TEXT.moreLabel}
      </Text>
    </Pressable>
  );
}
