'use client';

import {useEffect} from 'react';

export default function Page() {
  useEffect(() => {
    localStorage.setItem('userId', 'forworkchoe@gmail.com');
  }, []);

  return null;
}
