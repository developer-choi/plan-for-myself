'use client';

import {ENTRY_LABEL, getErrorInfo, RETRY_LABEL} from '@plan-for-myself/shared';
import {ENTRY_URL} from '@/auth/redirect';
import ErrorScreen from '@/shared/components/ErrorScreen';
import useReportPageError from '@/shared/error/useReportPageError';

interface ErrorPageProps {
  error: Error & {digest?: string};
  retry: () => void;
}

export default function ErrorPage({error, retry}: ErrorPageProps) {
  useReportPageError(error);
  const {title, content} = getErrorInfo(error);

  return (
    <ErrorScreen
      action={{children: RETRY_LABEL, onClick: retry}}
      content={content}
      link={{href: ENTRY_URL, label: ENTRY_LABEL}}
      title={title}
    />
  );
}
