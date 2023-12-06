import React, {MouseEvent, PropsWithChildren, useCallback, useEffect} from 'react';
import styled from 'styled-components';
import type {EssentialModalProp} from '@store/reducers/modal';

export interface ModalProp extends PropsWithChildren<EssentialModalProp> {
  disableEasilyClose?: boolean;
  className?: string;
}

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
    <Backdrop onClick={onBackdropClick}>
      <Inner onClick={onInnerClick} className={className}>
        {children}
      </Inner>
    </Backdrop>
  );
}

const Backdrop = styled.div`
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  overflow: auto;
`;

const Inner = styled.div`
  margin: auto;
  background-color: white;
`;
