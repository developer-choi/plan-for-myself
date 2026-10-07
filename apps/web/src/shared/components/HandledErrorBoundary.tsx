'use client';

import {type PropsWithChildren} from 'react';
import {QueryErrorResetBoundary, useQueryErrorResetBoundary} from '@tanstack/react-query';
import classNames from 'classnames';
import {catchError} from 'next/error';
import ErrorNotice from '@/shared/components/ErrorNotice';
import {getErrorInfo} from '@/shared/error/info';
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
  const {title, content} = getErrorInfo(error);

  return (
    <div className={classNames(styles.slot, {[styles.card]: size === 'card'})}>
      <ErrorNotice
        action={{
          children: '다시 시도',
          onClick: () => {
            resetQueryError();
            onReset?.();
            retry();
          },
        }}
        content={content}
        size={size === 'card' ? 'small' : 'large'}
        title={title}
      />
    </div>
  );
});
