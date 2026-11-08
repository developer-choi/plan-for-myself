import {useEffect} from 'react';
import {captureException} from '@sentry/react-native';

export default function useReportPageError(error: unknown): void {
  useEffect(() => {
    captureException(error);
  }, [error]);
}
