import React, {PropsWithChildren} from 'react';
import InnerSessionProvider from '@/util/sevices/auth/InnerSessionProvider';
import ClientAppProvider from '@/component/setting/ClientAppProvider';
import {SessionProvider} from 'next-auth/react';
import {auth} from '@/util/sevices/auth';
import '@/util/style/reset.css';
import '@/util/style/global.scss';

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
