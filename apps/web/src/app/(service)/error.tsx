'use client';

import ErrorScreen from '@/shared/components/ErrorScreen';
import {getErrorInfo} from '@/shared/error/info';
import useReportPageError from '@/shared/error/useReportPageError';

interface ErrorPageProps {
  error: Error & {digest?: string};
  retry: () => void;
}

export default function ErrorPage({error, retry}: ErrorPageProps) {
  useReportPageError(error);
  const {title, content} = getErrorInfo(error);

  return <ErrorScreen action={{children: '다시 시도', onClick: retry}} content={content} title={title} />;
}
