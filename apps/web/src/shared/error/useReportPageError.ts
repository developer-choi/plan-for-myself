import {useEffect} from 'react';
import {captureException} from '@sentry/nextjs';

export default function useReportPageError(error: unknown): void {
  useEffect(() => {
    if (isReportedByServer(error)) {
      return;
    }
    captureException(error);
  }, [error]);
}

function isReportedByServer(error: unknown): boolean {
  return error !== null && typeof error === 'object' && 'digest' in error && typeof error.digest === 'string';
}
