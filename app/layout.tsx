import React, {PropsWithChildren} from 'react';
import type {Metadata} from 'next';
import AppProvider from '@component/setting/AppProvider';
import '@/util/style/global.scss';

export const metadata: Metadata = {
  title: 'Plan for myself',
  description: "스스로 계획을 세우고 실천하도록 돕습니다.",
};

export default async function RootLayout({children}: PropsWithChildren) {
  return (
    <html lang="en">
    <body>
    <AppProvider>
      {children}
    </AppProvider>
    </body>
    </html>
  );
}
