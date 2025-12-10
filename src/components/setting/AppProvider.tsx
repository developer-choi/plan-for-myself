import React, {PropsWithChildren} from 'react';
import {auth} from '@/utils/service/auth';
import {SessionProvider} from 'next-auth/react';
import ReactQueryProvider from '@/components/setting/ReactQueryProvider';
import {ModalProvider} from '@forworkchoe/core/components';

export default async function AppProvider({children}: PropsWithChildren) {
  const session = await auth();

  return (
    <SessionProvider refetchOnWindowFocus={false} session={session}>
      <ReactQueryProvider>
        <ModalProvider>
          {children}
        </ModalProvider>
      </ReactQueryProvider>
    </SessionProvider>
  )
}
