import {type PropsWithChildren} from 'react';
import {StyleSheet, View} from 'react-native';
import {QueryErrorResetBoundary} from '@tanstack/react-query';
import {ErrorBoundary, type FallbackProps} from 'react-error-boundary';
import {getErrorInfo, RETRY_LABEL} from '@plan-for-myself/shared';
import ErrorNotice from '@/shared/components/ErrorNotice';
import {fallbackSlotSizes} from '@/shared/components/fallback-slot';
import useReportPageError from '@/shared/error/useReportPageError';

export default function HandledErrorBoundary({children}: PropsWithChildren) {
  return (
    <QueryErrorResetBoundary>
      {({reset}) => (
        <ErrorBoundary FallbackComponent={HandledErrorFallback} onReset={reset}>
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

const styles = StyleSheet.create({
  slot: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

function HandledErrorFallback({error, resetErrorBoundary}: FallbackProps) {
  useReportPageError(error);
  const {title, content} = getErrorInfo(error);

  return (
    <View style={[styles.slot, fallbackSlotSizes.screen]}>
      <ErrorNotice
        action={{label: RETRY_LABEL, onPress: resetErrorBoundary}}
        content={content}
        size="medium"
        title={title}
      />
    </View>
  );
}
