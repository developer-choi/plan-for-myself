'use client';

import classNames from 'classnames';
import {useRouter} from 'next/navigation';
import {ChevronLeftIcon} from '@radix-ui/react-icons';
import {IconButton} from '@developer-choi/design-system';
import typography from '@developer-choi/design-system/styles/typography';
import styles from './SubPageHeader.module.scss';

interface SubPageHeaderProps {
  title: string;
}

export default function SubPageHeader({title}: SubPageHeaderProps) {
  const router = useRouter();

  return (
    <header className={styles.header}>
      <IconButton aria-label="뒤로" icon={<ChevronLeftIcon />} onClick={() => router.back()} />
      <h1 className={classNames(typography.h4, typography.bold)}>{title}</h1>
    </header>
  );
}
