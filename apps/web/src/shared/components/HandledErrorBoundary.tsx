'use client';

import {type PropsWithChildren} from 'react';
import {QueryErrorResetBoundary, useQueryErrorResetBoundary} from '@tanstack/react-query';
import classNames from 'classnames';
import {catchError} from 'next/error';
import {getErrorInfo, RETRY_LABEL} from '@plan-for-myself/shared';
import ErrorNotice from '@/shared/components/ErrorNotice';
import useReportPageError from '@/shared/error/useReportPageError';
import {type FallbackSize} from '@/shared/types/fallback';
import styles from './FallbackSlot.module.scss';

interface HandledErrorBoundaryProps {
  onReset?: () => void;
  size?: FallbackSize;
}

export default function HandledErrorBoundary({children, ...props}: PropsWithChildren<HandledErrorBoundaryProps>) {
  return (
    <QueryErrorResetBoundary>
      <RetryableErrorBoundary {...props}>{children}</RetryableErrorBoundary>
    </QueryErrorResetBoundary>
  );
}

const RetryableErrorBoundary = catchError(({onReset, size = 'page'}: HandledErrorBoundaryProps, {error, retry}) => {
  const {reset: resetQueryError} = useQueryErrorResetBoundary();
  useReportPageError(error);
  const {title, content} = getErrorInfo(error);

  return (
    <div className={classNames(styles.slot, {[styles.card]: size === 'card'})}>
      <ErrorNotice
        action={{
          children: RETRY_LABEL,
          onClick: () => {
            resetQueryError();
            onReset?.();
            retry();
          },
        }}
        content={content}
        size={size === 'card' ? 'small' : 'medium'}
        title={title}
      />
    </div>
  );
});
