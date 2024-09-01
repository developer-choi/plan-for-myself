'use client';

import {useEffect} from 'react';
import {getRemindOfMessageListApiOnClient} from '@/utils/service/api/goal';
import {randomInArray} from '@/utils/extend/random';
import {toast, ToastContainer, ToastPosition} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CustomToastContainer() {
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
    <ToastContainer/>
  );
}

const TOAST_POSITIONS: ToastPosition[] = ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'];
