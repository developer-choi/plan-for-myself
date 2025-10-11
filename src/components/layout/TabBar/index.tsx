import React, {CSSProperties} from 'react';
import classNames from 'classnames';
import styles from './index.module.scss';
import {ActiveLink, ActiveLinkProps, LinkActiveMode} from '@forworkchoe/core/components';
import {isMobileOnBothSide} from '@/utils/extend/library/next';

export type TabBarItem = Omit<ActiveLinkProps, 'active'>;

export interface TabBarProps {
  /**
   * 디자인 시스템 > 탭의 규칙을 그대로 재현하였음.
   * equal-rate : 컨테이너 크기안에서 탭들이 동일한 비율의 너비를 가짐. 100px에 4탭이면 탭마다 25px만큼 차지함.
   * fix : 컨테이너 크기 상관없이 탭들이 고정적인 너비를 가짐.
   */
  widthMode: 'equal-rate' | 'fix';
  activeMode: LinkActiveMode;
  linkList: TabBarItem[];

  style?: CSSProperties;
  className?: string;
}

/**
 * 컨테이너의 가로길이만큼 탭바컨테이너도 늘어나고 그 안에 탭들이 노출되는 구조로 스타일링 되어있습니다.
 * Doc : https://docs.google.com/document/d/1I9RL3PafRfNwzKa7ZTvChWVygDlGWGyr57qSmr4FqOY/edit#heading=h.za52bsfg8q5d
 */
export default function TabBar({ widthMode, activeMode, style, className, linkList }: TabBarProps) {
  const isMobile = isMobileOnBothSide();

  return (
    <div
      style={style}
      className={classNames(styles.container, styles[widthMode], { [styles.mobile]: isMobile }, className)}
    >
      {linkList.map(({ children, ...rest }, index) => (
        <ActiveLink
          key={index}
          className={classNames(styles.item)}
          active={activeMode}
          {...rest}
        >
          <span className={styles.label}>{children}</span>
        </ActiveLink>
      ))}
    </div>
  );
}
