import {useCallback} from 'react';
import {overlay} from 'overlay-kit';
import {Alert} from '@developer-choi/design-system';
import {getErrorInfo} from '@/shared/error/info';

export function useHandleClientSideError(): (error: unknown) => void {
  return useCallback((error: unknown) => {
    const {title, content} = getErrorInfo(error);
    overlay.open(({isOpen, unmount}) => <Alert content={content} open={isOpen} title={title} onClose={unmount} />);
  }, []);
}
