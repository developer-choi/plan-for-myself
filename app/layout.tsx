import {PropsWithChildren} from 'react';
import type {Metadata} from 'next';

export const metadata: Metadata = {
  title: 'Plan for myself',
  description: "스스로 계획을 세우고 실천하도록 돕습니다.",
};

export default async function RootLayout({children}: PropsWithChildren) {
  return (
    <html lang="en">
    <body>{children}</body>
    </html>
  );
}
