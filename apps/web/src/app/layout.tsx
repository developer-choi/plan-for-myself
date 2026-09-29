import React, {PropsWithChildren} from 'react';
import type {Metadata} from 'next';
import {Noto_Sans} from 'next/font/google';

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
      <body className={font.className}>{children}</body>
    </html>
  );
}
