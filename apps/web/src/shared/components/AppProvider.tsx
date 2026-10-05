import React, {PropsWithChildren} from 'react';
import {Toaster} from '@developer-choi/design-system';
import {auth} from '@/auth/next-auth';
import {SessionProvider} from 'next-auth/react';
import {OverlayProvider} from 'overlay-kit';
import QueryProvider from '@/shared/components/QueryProvider';

export default async function AppProvider({children}: PropsWithChildren) {
  const session = await auth();

  return (
    <QueryProvider>
      <SessionProvider refetchOnWindowFocus={false} session={session}>
        <OverlayProvider>
          {children}
          <Toaster />
        </OverlayProvider>
      </SessionProvider>
    </QueryProvider>
  );
}
