import {type ReactNode} from 'react';
import type {FailureTag, FailureTagStatus, StudyRecordMonthly} from '@plan-for-myself/shared';
import {CheckIcon, Cross2Icon} from '@radix-ui/react-icons';
import typography from '@developer-choi/design-system/styles/typography';
import classNames from 'classnames';
import Card from '@/shared/components/Card';
import {formatMonthLabel} from '@/study-record-stats/format';
import styles from './FailCard.module.scss';

interface FailCardProps {
  monthly: StudyRecordMonthly;
  /* 태그 줄을 눌러 고르지 않는 화면(소개)이면 비운다 */
  selection?: FailCardTagSelection;
}

interface FailCardTagSelection {
  /* 아무 태그도 선택하지 않았으면 null */
  selectedTag: string | null;
  onSelect: (tag: string) => void;
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
  selection: FailCardTagSelection | undefined;
  children: ReactNode;
}

export default function FailCard({monthly, selection}: FailCardProps) {
  const {failureTags, inProgress} = monthly;
  const monthLabel = formatMonthLabel(monthly.month);
  const hasNoFailure = failureTags.length === 0;
  const repeatedTags = filterByStatus(failureTags, 'repeated');
  const appearedTags = filterByStatus(failureTags, 'appeared');
  const reducedTags = filterByStatus(failureTags, 'reduced');
  const firstTagName = [repeatedTags, appearedTags, reducedTags].find((tags) => tags.length > 0)?.[0].tag;
  const getTagRowId = (name: string) => (name === firstTagName ? FIRST_TAG_ROW_ID : undefined);

  return (
    <Card title={`${monthLabel} 실패`}>
      {hasNoFailure ? (
        <div className={styles.empty} role="status">
          <p className={classNames(typography.body2, styles.emptyTitle)}>{monthLabel}에 적은 실패가 없어요</p>
          <p className={classNames(typography.body3, styles.emptySub)}>실패를 적으면 지난달과 비교해 보여 줘요</p>
        </div>
      ) : (
        <div id={FAIL_GROUPS_ID}>
          <Group icon={<Cross2Icon />} tags={repeatedTags} title="반복하고 있어요" tone="fail">
            {(tag) => (
              <TagRow id={getTagRowId(tag.tag)} name={tag.tag} selection={selection}>
                지난달 {tag.previousCount}번 → {inProgress && '벌써 '}
                <span className={styles.count}>{tag.count}번</span>
              </TagRow>
            )}
          </Group>
          <Group icon={<Cross2Icon />} tags={appearedTags} title="새로 생겼어요" tone="fail">
            {(tag) => (
              <TagRow id={getTagRowId(tag.tag)} name={tag.tag} selection={selection}>
                {inProgress ? '이번 달' : monthLabel} 처음 · <span className={styles.count}>{tag.count}번</span>
              </TagRow>
            )}
          </Group>
          <Group
            icon={<CheckIcon />}
            tags={reducedTags}
            title={inProgress ? '줄어들고 있어요' : '줄었어요'}
            tone="success"
          >
            {(tag) => (
              <TagRow id={getTagRowId(tag.tag)} name={tag.tag} selection={selection}>
                지난달 {tag.previousCount}번 → <span className={styles.count}>{tag.count}번</span>
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
        <span className={styles.more}>자세히 ›</span>
      </span>
    </button>
  );
}

function filterByStatus(failureTags: FailureTag[], status: FailureTagStatus): FailureTag[] {
  return failureTags.filter((failureTag) => failureTag.status === status);
}
