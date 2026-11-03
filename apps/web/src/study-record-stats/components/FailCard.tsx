import {type ReactNode} from 'react';
import {
  type FailureTag,
  type FailureTagSelection,
  filterByStatus,
  formatAppearedNotePrefix,
  formatFailCardTitle,
  formatFailEmptyTitle,
  formatReducedGroupTitle,
  formatReducedNotePrefix,
  formatRepeatedNotePrefix,
  getFirstFailureTagName,
  STATS_TEXT,
  type StudyRecordMonthly,
} from '@plan-for-myself/shared';
import {CheckIcon, Cross2Icon} from '@radix-ui/react-icons';
import typography from '@developer-choi/design-system/styles/typography';
import classNames from 'classnames';
import Card from '@/shared/components/Card';
import styles from './FailCard.module.scss';

interface FailCardProps {
  monthly: StudyRecordMonthly;
  /* 태그 줄을 눌러 고르지 않는 화면(소개)이면 비운다 */
  selection?: FailureTagSelection;
}

interface GroupProps {
  title: string;
  icon: ReactNode;
  tone: 'fail' | 'success';
  tags: FailureTag[];
  children: (tag: FailureTag) => ReactNode;
}

interface TagRowProps {
  /* 카드에서 화면 맨 위에 그려지는 태그 줄이 아니면 undefined */
  id: string | undefined;
  name: string;
  /* FailCard가 selection을 받지 않으면 undefined */
  selection: FailureTagSelection | undefined;
  children: ReactNode;
}

export default function FailCard({monthly, selection}: FailCardProps) {
  const {failureTags, inProgress} = monthly;
  const hasNoFailure = failureTags.length === 0;
  const repeatedTags = filterByStatus(failureTags, 'repeated');
  const appearedTags = filterByStatus(failureTags, 'appeared');
  const reducedTags = filterByStatus(failureTags, 'reduced');
  const firstTagName = getFirstFailureTagName(failureTags);
  const getTagRowId = (name: string) => (name === firstTagName ? FIRST_TAG_ROW_ID : undefined);

  return (
    <Card title={formatFailCardTitle(monthly.month)}>
      {hasNoFailure ? (
        <div className={styles.empty}>
          <p className={classNames(typography.body2, styles.emptyTitle)}>{formatFailEmptyTitle(monthly.month)}</p>
          <p className={classNames(typography.body3, styles.emptySub)}>{STATS_TEXT.failEmptyHint}</p>
        </div>
      ) : (
        <div id={FAIL_GROUPS_ID}>
          <Group icon={<Cross2Icon />} tags={repeatedTags} title={STATS_TEXT.repeatedGroupTitle} tone="fail">
            {(tag) => (
              <TagRow id={getTagRowId(tag.tag)} name={tag.tag} selection={selection}>
                {formatRepeatedNotePrefix(tag.previousCount, inProgress)}
                <span className={styles.count}>{tag.count}번</span>
              </TagRow>
            )}
          </Group>
          <Group icon={<Cross2Icon />} tags={appearedTags} title={STATS_TEXT.appearedGroupTitle} tone="fail">
            {(tag) => (
              <TagRow id={getTagRowId(tag.tag)} name={tag.tag} selection={selection}>
                {formatAppearedNotePrefix(monthly.month, inProgress)}
                <span className={styles.count}>{tag.count}번</span>
              </TagRow>
            )}
          </Group>
          <Group icon={<CheckIcon />} tags={reducedTags} title={formatReducedGroupTitle(inProgress)} tone="success">
            {(tag) => (
              <TagRow id={getTagRowId(tag.tag)} name={tag.tag} selection={selection}>
                {formatReducedNotePrefix(tag.previousCount)}
                <span className={styles.count}>{tag.count}번</span>
              </TagRow>
            )}
          </Group>
        </div>
      )}
    </Card>
  );
}

export const FAIL_GROUPS_ID = 'fail-card-groups';
export const FIRST_TAG_ROW_ID = 'fail-card-first-tag-row';

function Group({title, icon, tone, tags, children}: GroupProps) {
  if (tags.length === 0) {
    return null;
  }

  return (
    <section className={classNames(styles.group, styles[tone])}>
      <div className={styles.groupHeader}>
        <span className={styles.groupIcon}>{icon}</span>
        <h3 className={classNames(typography.body3, typography.bold)}>{title}</h3>
      </div>
      <ol>
        {tags.map((tag) => (
          <li key={tag.tag}>{children(tag)}</li>
        ))}
      </ol>
    </section>
  );
}

function TagRow({id, name, selection, children}: TagRowProps) {
  const isSelected = selection?.selectedTag === name;

  return (
    <button
      className={classNames(typography.body2, styles.tagRow)}
      data-selected={isSelected || undefined}
      id={id}
      type="button"
      onClick={() => selection?.onSelect(name)}
    >
      <span className={styles.tagRowInner}>
        <span className={styles.tagName}>{name}</span>
        <span className={styles.tagText}>{children}</span>
        <span className={styles.more}>{STATS_TEXT.moreLabel}</span>
      </span>
    </button>
  );
}
