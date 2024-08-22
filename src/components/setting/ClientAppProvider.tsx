'use client';

import React, {PropsWithChildren, useCallback, useEffect} from 'react';
import {Provider} from 'react-redux';
import {store} from '@/store/store';
import {QueryClient, QueryClientProvider} from 'react-query';
import {useAppDispatch, useAppSelector} from '@/store/hooks';
import {closeModal} from '@/store/reducers/modal';
import 'react-toastify/dist/ReactToastify.css';
import {toast, ToastContainer, ToastPosition} from 'react-toastify';
import {randomInArray} from '@/utils/extend/random';
import {getRemindOfMessageListApiOnClient} from '@/utils/service/api/goal';

export default function ClientAppProvider({children}: PropsWithChildren) {
  useEffect(() => {
    getRemindOfMessageListApiOnClient().then(list => {
      if (list.length === 0) {
        return;
      }

      const position = randomInArray(TOAST_POSITIONS)[0];

      randomInArray(list, 2).forEach(item => {
        toast.info(item.message, {
          autoClose: 99999999,
          position,
          hideProgressBar: true,
          closeButton: false,
          closeOnClick: true,
          theme: 'colored',
          draggable: false
        });
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

const TOAST_POSITIONS: ToastPosition[] = ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'];
