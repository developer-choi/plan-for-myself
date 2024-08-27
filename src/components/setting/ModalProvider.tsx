'use client';

import {createContext, PropsWithChildren, useCallback, useState} from 'react';
import {EssentialModalProps, ModalPayload, ModalState} from '@/utils/extend/modal';

export const ModalContext = createContext<ModalState<EssentialModalProps>>({
  modals: [],
  openModal: () => {}
});

export default function ModalProvider({children}: PropsWithChildren) {
  const [modals, setModals] = useState<ModalState<EssentialModalProps>['modals']>([]);

  const onClose = useCallback((targetId: number) => {
    setModals(prevState => prevState.filter(props => props.pk != targetId));
  }, []);

  const openModal = useCallback(<P extends EssentialModalProps>(payload: ModalPayload<P>) => {
    const pk = Date.now();

    setModals(prevState => prevState.concat({
      pk,
      Component: payload.Component as (props: EssentialModalProps) => JSX.Element | null,
      props: payload.props
    }));
  }, []);

  return (
    <ModalContext.Provider value={{modals, openModal}}>
      {children}
      {modals.map(({pk, props, Component}) => (
        <Component key={pk} onClose={() => onClose(pk)} {...props}/>
      ))}
    </ModalContext.Provider>
  );
}
