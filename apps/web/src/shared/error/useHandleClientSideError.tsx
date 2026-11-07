import {useCallback} from 'react';
import {openOnce} from '@plan-for-myself/shared/react';
import {Alert} from '@developer-choi/design-system';
import {getErrorInfo} from '@/shared/error/info';

export function useHandleClientSideError(): (error: unknown) => void {
  return useCallback((error: unknown) => {
    const {title, content} = getErrorInfo(error);
    openOnce('client-side-error', ({isOpen, unmount}) => (
      <Alert content={content} open={isOpen} title={title} onClose={unmount} />
    ));
  }, []);
}
