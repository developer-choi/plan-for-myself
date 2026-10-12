import {type ComponentType, type ReactNode} from 'react';
import Link from 'next/link';
import classNames from 'classnames';
import {ChevronLeftIcon, ChevronRightIcon} from '@radix-ui/react-icons';
import {IconButton} from '@developer-choi/design-system';
import typography from '@developer-choi/design-system/styles/typography';
import styles from './SubPageHeader.module.scss';

interface SubPageHeaderProps {
  title: string;
  exit: SubPageHeaderExit;
  /* 달을 넘겨 보지 않는 화면(계정·개인정보)이면 비운다 */
  monthNavigation?: SubPageMonthNavigation;
}

interface SubPageHeaderExit {
  href: string;
  label: string;
  icon: ComponentType<{width: number; height: number}>;
}

interface SubPageMonthNavigation {
  /* 첫 기록이 있는 달이거나 첫 기록 날짜를 아직 모르면 비운다 */
  previousHref?: string;
  /* 이번 달이거나 첫 기록 날짜를 아직 모르면 비운다 */
  nextHref?: string;
}

interface MonthLinkProps {
  /* 그 쪽으로 갈 수 없으면 undefined */
  href: string | undefined;
  label: string;
  icon: ReactNode;
}

export default function SubPageHeader({title, exit, monthNavigation}: SubPageHeaderProps) {
  const ExitIcon = exit.icon;
  const exitLink = (
    <IconButton
      asChild
      aria-label={exit.label}
      className={styles.exit}
      icon={<ExitIcon height={EXIT_ICON_SIZE} width={EXIT_ICON_SIZE} />}
    >
      <Link href={exit.href} />
    </IconButton>
  );

  const heading = <h1 className={classNames(typography.h4, typography.bold, styles.title)}>{title}</h1>;

  return (
    <header className={styles.header}>
      {exitLink}
      {monthNavigation ? (
        <div className={styles.monthNavigation}>
          <MonthLink href={monthNavigation.previousHref} icon={<ChevronLeftIcon />} label="이전 달" />
          {heading}
          <MonthLink href={monthNavigation.nextHref} icon={<ChevronRightIcon />} label="다음 달" />
        </div>
      ) : (
        heading
      )}
    </header>
  );
}

/* 갈 수 없는 쪽도 같은 크기의 빈 자리를 남겨 제목이 달마다 흔들리지 않게 한다 */
function MonthLink({href, label, icon}: MonthLinkProps) {
  if (href === undefined) {
    return <IconButton className={styles.hiddenMonthLink} icon={icon} />;
  }

  return (
    <IconButton asChild aria-label={label} icon={icon}>
      <Link href={href} />
    </IconButton>
  );
}

/* 달력 머리의 메뉴 버튼(HeaderMenu MENU_ICON_SIZE)과 같은 크기로 맞춰 두 머리가 한 쌍으로 읽히게 한다 */
const EXIT_ICON_SIZE = 24;
