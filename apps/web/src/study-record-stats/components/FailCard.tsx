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
}

interface GroupProps {
  title: string;
  icon: ReactNode;
  tone: 'fail' | 'success';
  tags: FailureTag[];
  /* 제목 오른쪽 글이 없는 묶음(반복·새로 생김)이면 비운다 */
  aside?: string;
  children: (tag: FailureTag) => ReactNode;
}

interface TagRowProps {
  name: string;
  children: ReactNode;
}

export default function FailCard({monthly}: FailCardProps) {
  const {failureTags, inProgress} = monthly;
  const monthLabel = formatMonthLabel(monthly.month);
  const hasNoFailure = failureTags.length === 0;
  const reducedTags = filterByStatus(failureTags, 'reduced');

  return (
    <Card title={`${monthLabel} 실패`}>
      {hasNoFailure ? (
        <div className={styles.empty} role="status">
          <p className={classNames(typography.body2, styles.emptyTitle)}>{monthLabel}에 적은 실패가 없어요</p>
          <p className={classNames(typography.body3, styles.emptySub)}>실패를 적으면 지난달과 비교해 보여 줘요</p>
        </div>
      ) : (
        <>
          <Group
            icon={<Cross2Icon />}
            tags={filterByStatus(failureTags, 'repeated')}
            title="반복하고 있어요"
            tone="fail"
          >
            {(tag) => (
              <TagRow name={tag.tag}>
                지난달 {tag.previousCount}번 → {inProgress && '벌써 '}
                <span className={styles.count}>{tag.count}번</span>
              </TagRow>
            )}
          </Group>
          <Group icon={<Cross2Icon />} tags={filterByStatus(failureTags, 'appeared')} title="새로 생겼어요" tone="fail">
            {(tag) => (
              <TagRow name={tag.tag}>
                {inProgress ? '이번 달' : monthLabel} 처음 · <span className={styles.count}>{tag.count}번</span>
              </TagRow>
            )}
          </Group>
          <Group
            aside={`개선된 실패 +${reducedTags.length}`}
            icon={<CheckIcon />}
            tags={reducedTags}
            title={inProgress ? '줄어들고 있어요' : '줄었어요'}
            tone="success"
          >
            {(tag) => (
              <TagRow name={tag.tag}>
                지난달 {tag.previousCount}번 → <span className={styles.count}>{tag.count}번</span>
              </TagRow>
            )}
          </Group>
        </>
      )}
    </Card>
  );
}

function Group({title, icon, tone, tags, aside, children}: GroupProps) {
  if (tags.length === 0) {
    return null;
  }

  return (
    <section className={classNames(styles.group, styles[tone])}>
      <div className={styles.groupHeader}>
        <span className={styles.groupIcon}>{icon}</span>
        <h3 className={classNames(typography.body3, typography.bold)}>{title}</h3>
        {aside !== undefined && (
          <span className={classNames(typography.body3, typography.bold, styles.groupAside)}>{aside}</span>
        )}
      </div>
      <ol>
        {tags.map((tag) => (
          <li key={tag.tag}>{children(tag)}</li>
        ))}
      </ol>
    </section>
  );
}

function TagRow({name, children}: TagRowProps) {
  return (
    <button className={classNames(typography.body2, styles.tagRow)} type="button">
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
