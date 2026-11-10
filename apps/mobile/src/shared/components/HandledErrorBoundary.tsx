import {type PropsWithChildren} from 'react';
import {StyleSheet, View} from 'react-native';
import {QueryErrorResetBoundary} from '@tanstack/react-query';
import {ErrorBoundary, type FallbackProps} from 'react-error-boundary';
import {getErrorInfo, RETRY_LABEL} from '@plan-for-myself/shared';
import ErrorNotice from '@/shared/components/ErrorNotice';
import {fallbackSlotSizes} from '@/shared/components/fallback-slot';
import useReportPageError from '@/shared/error/useReportPageError';
import {type FallbackSize} from '@/shared/types/fallback';

interface HandledErrorBoundaryProps extends PropsWithChildren {
  size?: FallbackSize;
}

interface HandledErrorFallbackProps extends FallbackProps {
  size: FallbackSize;
}

export default function HandledErrorBoundary({children, size = 'screen'}: HandledErrorBoundaryProps) {
  return (
    <QueryErrorResetBoundary>
      {({reset}) => (
        <ErrorBoundary
          fallbackRender={(fallbackProps) => <HandledErrorFallback {...fallbackProps} size={size} />}
          onReset={reset}
        >
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

function HandledErrorFallback({error, resetErrorBoundary, size}: HandledErrorFallbackProps) {
  useReportPageError(error);
  const {title, content} = getErrorInfo(error);

  return (
    <View style={[styles.slot, fallbackSlotSizes[size]]}>
      <ErrorNotice
        action={{label: RETRY_LABEL, onPress: resetErrorBoundary}}
        content={content}
        size={size === 'card' ? 'small' : 'medium'}
        title={title}
      />
    </View>
  );
}
