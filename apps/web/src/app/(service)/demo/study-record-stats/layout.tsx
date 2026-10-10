import type {ReactNode} from 'react';
import DemoTourTrigger from '@/demo/components/DemoTourTrigger';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({children}: LayoutProps) {
  return (
    <>
      {children}
      <DemoTourTrigger part="stats" />
    </>
  );
}
