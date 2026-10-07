import {type PropsWithChildren} from 'react';
import typography from '@developer-choi/design-system/styles/typography';
import classNames from 'classnames';
import styles from './StatList.module.scss';

interface StatListItemProps {
  label: string;
  value: string;
  /* 값 옆 회색 보조 글이 없는 줄이면 비운다 */
  note?: string;
}

export default function StatList({children}: PropsWithChildren) {
  return <dl>{children}</dl>;
}

export function StatListItem({label, value, note}: StatListItemProps) {
  return (
    <div className={styles.item}>
      <dt className={classNames(typography.body2, styles.label)}>{label}</dt>
      <dd className={styles.values}>
        <span className={classNames(typography.body1, typography.bold, styles.number)}>{value}</span>
        {note !== undefined && <span className={classNames(typography.body3, styles.note)}>{note}</span>}
      </dd>
    </div>
  );
}
