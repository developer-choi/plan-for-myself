'use client';

import {type PropsWithChildren} from 'react';
import classNames from 'classnames';
import {ErrorBoundary, type FallbackProps} from 'react-error-boundary';
import ErrorNotice from '@/shared/components/ErrorNotice';
import {type FallbackSize} from '@/shared/types/fallback';
import styles from './FallbackSlot.module.scss';

interface HandledErrorBoundaryProps {
  onReset?: () => void;
  size?: FallbackSize;
}

export default function HandledErrorBoundary({
  onReset,
  size = 'page',
  children,
}: PropsWithChildren<HandledErrorBoundaryProps>) {
  return (
    <ErrorBoundary
      fallbackRender={({resetErrorBoundary}) => <Fallback resetErrorBoundary={resetErrorBoundary} size={size} />}
      onReset={onReset}
    >
      {children}
    </ErrorBoundary>
  );
}

const FALLBACK_TITLE = '불러오지 못했어요';
const FALLBACK_CONTENT = '잠시 뒤 다시 시도해 주세요';

interface FallbackComponentProps extends Pick<FallbackProps, 'resetErrorBoundary'> {
  size: FallbackSize;
}

function Fallback({resetErrorBoundary, size}: FallbackComponentProps) {
  return (
    <div className={classNames(styles.slot, {[styles.card]: size === 'card'})}>
      <ErrorNotice
        action={{children: '다시 시도', onClick: resetErrorBoundary}}
        content={FALLBACK_CONTENT}
        size={size === 'card' ? 'small' : 'large'}
        title={FALLBACK_TITLE}
      />
    </div>
  );
}
