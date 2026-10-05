'use client';

import {type PropsWithChildren, useState} from 'react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

export default function QueryProvider({children}: PropsWithChildren) {
  const [queryClient] = useState(
    () => new QueryClient({defaultOptions: {queries: {retry: 0, staleTime: STALE_TIME_MS}}}),
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

const STALE_TIME_MS = 60_000;
