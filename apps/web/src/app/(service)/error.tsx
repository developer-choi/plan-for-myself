'use client';

import ErrorNotice from '@/shared/components/ErrorNotice';
import {getErrorInfo} from '@/shared/error/info';
import styles from './error.module.scss';

interface ErrorPageProps {
  error: Error & {digest?: string};
  retry: () => void;
}

export default function ErrorPage({error, retry}: ErrorPageProps) {
  const {title, content} = getErrorInfo(error);

  return (
    <main className={styles.main}>
      <ErrorNotice action={{children: '다시 시도', onClick: retry}} content={content} title={title} />
    </main>
  );
}
