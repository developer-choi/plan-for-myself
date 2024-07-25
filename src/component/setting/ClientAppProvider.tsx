'use client';

import React, {PropsWithChildren, useCallback, useEffect} from 'react';
import {Provider} from 'react-redux';
import {store} from '@/store/store';
import {QueryClient, QueryClientProvider} from 'react-query';
import {useAppDispatch, useAppSelector} from '@/store/hooks';
import {closeModal} from '@/store/reducers/modal';
import 'react-toastify/dist/ReactToastify.css';
import {toast, ToastContainer} from 'react-toastify';
import {randomInArray} from '@/util/extend/random';
import {getRemindOfMessageListApiOnClient} from '@/util/sevices/api/goal-client';

export default function ClientAppProvider({children}: PropsWithChildren) {
  useEffect(() => {
    getRemindOfMessageListApiOnClient().then(list => {
      if (list.length === 0) {
        return;
      }

      const item = randomInArray(list);

      toast.info(item.message, {
        autoClose: 5000,
        position: 'top-center',
        hideProgressBar: true,
        closeButton: false,
        closeOnClick: true,
        theme: 'colored'
      });
    }).catch(() => {});
  }, []);

  return (
    <QueryClientProvider client={INSTANCE}>
      <Provider store={store}>
        {children}
        <ModalRender/>
        <ToastContainer/>
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
