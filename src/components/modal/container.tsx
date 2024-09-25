'use client';

import {ComponentPropsWithoutRef, MouseEvent, useCallback, useEffect, useRef} from 'react';
import styles from './container.module.scss';
import classNames from 'classnames';
import {EssentialModalProps} from '@/utils/extend/modal';

export interface ModalContainerProps extends EssentialModalProps, Omit<ComponentPropsWithoutRef<'div'>, 'onClick'> {
  easilyClose?: boolean; // backdrop / esc 눌러서 모달 닫게 해주는 기능, default false
  type?: 'centerAlign' | 'bottomSheet' | 'fullScreen'; // default centerAlign
  size?: 'large' | 'medium'; // centerAlign 모달에서만 사용함
  open?: boolean;
  disableOpenFocus?: boolean; // open 시 젤 위에있는 포커스받을 수 있는 요소에 포커스 가는 기능 비활성화 default false
}

// Alert, Confirm 등 모달 확장할 때 이 타입을 확장하기
export type ComposedModalProps = Omit<ModalContainerProps, 'type' | 'size' | 'disableOpenFocus'>;

export function ModalContainer({className, type = 'centerAlign', size = 'medium', easilyClose, onClose, open, disableOpenFocus = false, ...rest}: ModalContainerProps) {
  const modalRef = useRef<HTMLDialogElement>(null);
  /**
   * bottomSheet면 기본값 false로 동작하고
   * 나머지는 기본값 true로 동작함.
   */
  const _open = type === 'bottomSheet' ? !!open : open ?? true;

  useEffect(() => {
    const escHandler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (easilyClose) {
          onClose();
        } else {
          event.preventDefault();
        }
      }
    }

    document.addEventListener('keydown', escHandler);

    return () => {
      document.removeEventListener('keydown', escHandler);
    };
  }, [easilyClose, onClose]);

  useEffect(() => {
    const modal = modalRef.current;

    const closeModal = () => {
      modal?.close();
      document.body.style.overflow = 'auto';
    };

    if (!_open) {
      closeModal();
      return;
    }

    modal?.showModal();
    document.body.style.overflow = 'hidden';

    return closeModal;
  }, [_open]);

  const onClickBackdrop = useCallback((event: MouseEvent<HTMLDivElement>) => {
    if (!easilyClose) {
      return;
    }

    event.stopPropagation();
  }, [easilyClose]);

  return (
    <dialog ref={modalRef} className={classNames(styles.rootModalContainer, styles[type + 'Container'], {[styles.open]: _open})} onClick={easilyClose ? onClose : undefined}>
      {!disableOpenFocus ? null : (<button className={styles.disableOpenFocus}/>)}
      <div className={classNames(styles.rootModalInner, styles[type + 'Inner'], styles[size], className)} onClick={onClickBackdrop} {...rest} />
    </dialog>
  )
}
