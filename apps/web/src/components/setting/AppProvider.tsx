import React, {PropsWithChildren} from 'react';
import {auth} from '@/utils/service/auth';
import {SessionProvider} from 'next-auth/react';

export default async function AppProvider({children}: PropsWithChildren) {
  const session = await auth();

  return (
    <SessionProvider refetchOnWindowFocus={false} session={session}>
      {children}
    </SessionProvider>
  )
}
