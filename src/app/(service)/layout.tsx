import React, {PropsWithChildren} from 'react';
import InnerSessionProvider from '@/utils/service/auth/InnerSessionProvider';
import ClientAppProvider from '@/components/setting/ClientAppProvider';
import {SessionProvider} from 'next-auth/react';
import {auth} from '@/utils/service/auth';
import '@/styles/reset.css';
import '@/styles/global.scss';

export default async function ServiceLayout({children}: PropsWithChildren) {
  const session = await auth();

  return (
    <SessionProvider refetchOnWindowFocus={false} session={session}>
      <InnerSessionProvider>
        <ClientAppProvider>
          {children}
        </ClientAppProvider>
      </InnerSessionProvider>
    </SessionProvider>
  );
}
