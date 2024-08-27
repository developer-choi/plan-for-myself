'use client';

import React, {PropsWithChildren, useEffect} from 'react';
import {QueryClient, QueryClientProvider} from 'react-query';
import 'react-toastify/dist/ReactToastify.css';
import {toast, ToastContainer, ToastPosition} from 'react-toastify';
import {randomInArray} from '@/utils/extend/random';
import {getRemindOfMessageListApiOnClient} from '@/utils/service/api/goal';
import ModalProvider from '@/components/setting/ModalProvider';

export default function AppProvider({children}: PropsWithChildren) {
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
      <ModalProvider>
        {children}
      </ModalProvider>
      <ToastContainer toastStyle={{lineHeight: '20px'}}/>
    </QueryClientProvider>
  )
}

const INSTANCE = new QueryClient();

const TOAST_POSITIONS: ToastPosition[] = ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'];
