import React, {PropsWithChildren} from 'react';
import AppProvider from '@/components/setting/AppProvider';
import '@/styles/reset.css';
import '@forworkchoe/core/core.css';
import '@/styles/global.scss';

export default async function ServiceLayout({children}: PropsWithChildren) {
  return (
    <AppProvider>
      {children}
    </AppProvider>
  );
}
