import {type ComponentProps, type ReactNode} from 'react';
import classNames from 'classnames';
import typography from '@developer-choi/design-system/styles/typography';
import styles from './Card.module.scss';

export interface CardProps extends Pick<ComponentProps<'div'>, 'id' | 'className' | 'children'> {
  /* 제목 줄이 없는 카드(개인정보·계정 화면)면 비운다 */
  title?: ReactNode;
  /* 제목 줄 오른쪽 보조 글이 없으면 비운다 */
  aside?: ReactNode;
}

export default function Card({id, title, aside, className, children}: CardProps) {
  const hasTitle = isFilled(title);
  const hasAside = isFilled(aside);

  return (
    <div className={classNames(styles.card, className)} id={id}>
      {(hasTitle || hasAside) && (
        <div className={styles.header}>
          {hasTitle && <h2 className={classNames(typography.body2, typography.bold, styles.title)}>{title}</h2>}
          {hasAside && <span className={styles.aside}>{aside}</span>}
        </div>
      )}
      {children}
    </div>
  );
}

function isFilled(node: ReactNode) {
  return node !== undefined && node !== null && node !== false && node !== '';
}
