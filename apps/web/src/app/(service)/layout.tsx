import React, {PropsWithChildren} from 'react';
import AppProvider from '@/shared/components/AppProvider';

export default function ServiceLayout({children}: PropsWithChildren) {
  return <AppProvider>{children}</AppProvider>;
}
