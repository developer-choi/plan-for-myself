'use client';

import ErrorNotice from '@/shared/components/ErrorNotice';
import styles from './error.module.scss';

interface ErrorPageProps {
  reset: () => void;
}

export default function ErrorPage({reset}: ErrorPageProps) {
  return (
    <main className={styles.main}>
      <ErrorNotice
        action={{children: '다시 시도', onClick: reset}}
        content={'요청을 처리하는 중에 서버에 문제가 생겼어요.\n잠시 후 다시 시도해 주세요.'}
        title="일시적인 오류가 발생했어요"
      />
    </main>
  );
}
