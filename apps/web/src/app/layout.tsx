import '@developer-choi/design-system/style.css';
import React, {PropsWithChildren} from 'react';
import type {Metadata} from 'next';
import {Noto_Sans} from 'next/font/google';
import classNames from 'classnames';
import {themeClassName} from '@developer-choi/design-system';
import {themeStyle} from '@/styles/theme';

const font = Noto_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: 'Plan for myself',
  description: '스스로 계획을 세우고 실천하도록 돕습니다.',
};

export default function RootLayout({children}: PropsWithChildren) {
  return (
    <html lang="en">
      <body className={classNames(font.className, themeClassName)} style={themeStyle}>
        {children}
      </body>
    </html>
  );
}
