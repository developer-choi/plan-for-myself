import React, {CSSProperties} from 'react';
import classNames from 'classnames';
import styles from './index.module.scss';
import ActiveLink, {ActiveLinkProps, LinkActiveMode} from '@/components/design-system/element/link/ActiveLink';

export type TabBarItem = Omit<ActiveLinkProps, 'enableActive'>;

export interface TabBarProps {
  widthMode: 'equal-rate' | 'fix';
  activeMode: LinkActiveMode;
  linkList: TabBarItem[];

  style?: CSSProperties;
  className?: string;
}

export default function TabBar({ widthMode, activeMode, style, className, linkList }: TabBarProps) {
  const isMobile = true;

  return (
    <div
      style={style}
      className={classNames(styles.container, styles[widthMode], { [styles.mobile]: isMobile }, className)}
    >
      {linkList.map(({ children, ...rest }, index) => (
        <ActiveLink
          key={index}
          className={classNames(styles.item)}
          enableActive={{ mode: activeMode, className: styles.active }}
          {...rest}
        >
          <span className={styles.label}>{children}</span>
        </ActiveLink>
      ))}
    </div>
  );
}
