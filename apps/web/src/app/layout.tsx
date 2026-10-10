import '@developer-choi/design-system/style.css';
import React, {PropsWithChildren} from 'react';
import type {Metadata} from 'next';
import classNames from 'classnames';
import {themeClassName} from '@developer-choi/design-system';
import {font} from '@/shared/styles/font';
import {themeStyle} from '@/shared/styles/theme';

export const metadata: Metadata = {
  metadataBase: new URL('https://plan-for-myself.vercel.app'),
  title: 'Plan for myself',
  description: '스스로 목표를 세우고 달성하는 것을 돕습니다.',
  openGraph: {
    siteName: 'Plan for myself',
    locale: 'ko_KR',
    type: 'website',
  },
};

export default function RootLayout({children}: PropsWithChildren) {
  return (
    <html lang="ko">
      <body className={classNames(font.className, themeClassName)} style={themeStyle}>
        {children}
      </body>
    </html>
  );
}
