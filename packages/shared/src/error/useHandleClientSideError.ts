import {type ComponentType, createElement, useCallback} from 'react';
import {openOnce} from '../overlay/open-once';
import {getErrorInfo} from './info';

interface ErrorAlertProps {
  open: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

export default function useHandleClientSideError(alert: ComponentType<ErrorAlertProps>): (error: unknown) => void {
  return useCallback(
    (error: unknown) => {
      const {title, content} = getErrorInfo(error);
      openOnce('client-side-error', ({isOpen, unmount}) =>
        createElement(alert, {content, open: isOpen, title, onClose: unmount}),
      );
    },
    [alert],
  );
}
