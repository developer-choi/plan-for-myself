'use client';

import React, {MouseEvent, PropsWithChildren, useCallback, useEffect} from 'react';
import type {EssentialModalProp} from '@/store/reducers/modal';
import styles from './index.module.scss';
import classNames from 'classnames';

export interface ModalProp extends PropsWithChildren<EssentialModalProp> {
  disableEasilyClose?: boolean;
  className?: string;
}

// 반드시 Client Component에서만 사용할것
export default function Modal({disableEasilyClose = false, closeModal, children, className}: ModalProp) {
  const onBackdropClick = useCallback(() => {
    if (!disableEasilyClose) {
      closeModal();
    }
  }, [disableEasilyClose, closeModal]);

  const onInnerClick = useCallback((event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  }, []);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.body.focus();

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className={styles.backdrop} onClick={onBackdropClick}>
      <div onClick={onInnerClick} className={classNames(styles.inner, className)}>
        {children}
      </div>
    </div>
  );
}
