import React, {PropsWithChildren} from 'react';
import AppProvider from '@/components/setting/AppProvider';
import '@/styles/global.scss';

export default async function ServiceLayout({children}: PropsWithChildren) {
  return (
    <AppProvider>
      {children}
    </AppProvider>
  );
}
