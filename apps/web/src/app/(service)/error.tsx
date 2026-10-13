'use client';

import {ENTRY_URL} from '@/auth/redirect';
import ErrorScreen from '@/shared/components/ErrorScreen';
import {getErrorInfo} from '@/shared/error/info';
import useReportPageError from '@/shared/error/useReportPageError';
import {ENTRY_LABEL} from '@/shared/labels';

interface ErrorPageProps {
  error: Error & {digest?: string};
  retry: () => void;
}

export default function ErrorPage({error, retry}: ErrorPageProps) {
  useReportPageError(error);
  const {title, content} = getErrorInfo(error);

  return (
    <ErrorScreen
      action={{children: '다시 시도', onClick: retry}}
      content={content}
      link={{href: ENTRY_URL, label: ENTRY_LABEL}}
      title={title}
    />
  );
}
