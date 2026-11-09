'use client';

import {ENTRY_LABEL, RETRY_LABEL} from '@plan-for-myself/shared/label';
import {getErrorInfo} from '@plan-for-myself/shared/error';
import {ENTRY_URL} from '@/auth/redirect';
import ErrorNotice from '@/shared/components/ErrorNotice';
import useReportPageError from '@/shared/error/useReportPageError';

interface ErrorPageProps {
  error: Error & {digest?: string};
  retry: () => void;
}

export default function ErrorPage({error, retry}: ErrorPageProps) {
  useReportPageError(error);
  const {title, content} = getErrorInfo(error);

  return (
    <ErrorNotice
      action={{children: RETRY_LABEL, onClick: retry}}
      content={content}
      link={{href: ENTRY_URL, label: ENTRY_LABEL}}
      title={title}
    />
  );
}
