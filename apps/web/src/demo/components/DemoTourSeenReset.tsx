'use client';

import {useEffect} from 'react';
import {usePathname} from 'next/navigation';
import {isDemoPath} from '@/demo/demo-path';
import {clearDemoTourSeen} from '@/demo/demo-tour-seen';

export default function DemoTourSeenReset() {
  const pathname = usePathname();

  useEffect(() => {
    if (!isDemoPath(pathname)) {
      clearDemoTourSeen();
    }
  }, [pathname]);

  return null;
}
