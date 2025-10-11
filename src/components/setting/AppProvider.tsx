import React, {PropsWithChildren} from 'react';
import {auth} from '@/utils/service/auth';
import {SessionProvider} from 'next-auth/react';
import ReactQueryProvider from '@/components/setting/ReactQueryProvider';
import {ModalProvider} from '@forworkchoe/core/components';
import dynamic from 'next/dynamic';

// 첫 페이지 로딩 시점에 안보여도 되는 것들은 모두 dynamic import 하기로 함
const CustomToastContainer = dynamic(() => import('@/components/setting/CustomToastContainer'), {ssr: false});

export default async function AppProvider({children}: PropsWithChildren) {
  const session = await auth();

  return (
    <SessionProvider refetchOnWindowFocus={false} session={session}>
      <ReactQueryProvider>
        <ModalProvider>
          {children}
        </ModalProvider>
        <CustomToastContainer/>
      </ReactQueryProvider>
    </SessionProvider>
  )
}
