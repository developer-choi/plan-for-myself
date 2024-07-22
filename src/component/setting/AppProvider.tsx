'use client';

import React, {PropsWithChildren, useCallback} from 'react';
import {Provider} from 'react-redux';
import {store} from '@store/store';
import {QueryClient, QueryClientProvider} from 'react-query';
import {useAppDispatch, useAppSelector} from '@store/hooks';
import {closeModal} from '@store/reducers/modal';

export default function AppProvider({children}: PropsWithChildren) {
  return (
    <QueryClientProvider client={INSTANCE}>
      <Provider store={store}>
        {children}
        <ModalRender/>
      </Provider>
    </QueryClientProvider>
  )
}

const INSTANCE = new QueryClient();

function ModalRender() {
  const modals = useAppSelector(state => state.modal.modals);
  const dispatch = useAppDispatch();

  const close = useCallback((pk: number) => {
    dispatch(closeModal(pk));
  }, [dispatch]);

  return (
    <>
      {modals.map(({pk, Component, props}) => (
        <Component key={pk} closeModal={() => close(pk)} {...props}/>
      ))}
    </>
  );
}
