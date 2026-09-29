import React, {PropsWithChildren} from 'react';
import AppProvider from '@/components/setting/AppProvider';

export default function ServiceLayout({children}: PropsWithChildren) {
  return <AppProvider>{children}</AppProvider>;
}
