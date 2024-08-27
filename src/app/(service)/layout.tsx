import React, {PropsWithChildren} from 'react';
import InnerSessionProvider from '@/utils/service/auth/InnerSessionProvider';
import AppProvider from '@/components/setting/AppProvider';
import {SessionProvider} from 'next-auth/react';
import {auth} from '@/utils/service/auth';
import '@/styles/reset.css';
import '@/styles/global.scss';

export default async function ServiceLayout({children}: PropsWithChildren) {
  const session = await auth();

  return (
    <SessionProvider refetchOnWindowFocus={false} session={session}>
      <InnerSessionProvider>
        <AppProvider>
          {children}
        </AppProvider>
      </InnerSessionProvider>
    </SessionProvider>
  );
}
