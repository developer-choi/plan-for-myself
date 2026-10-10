import React, {PropsWithChildren} from 'react';
import DemoTourSeenReset from '@/demo/components/DemoTourSeenReset';
import AppProvider from '@/shared/components/AppProvider';

export default function ServiceLayout({children}: PropsWithChildren) {
  return (
    <AppProvider>
      <DemoTourSeenReset />
      {children}
    </AppProvider>
  );
}
