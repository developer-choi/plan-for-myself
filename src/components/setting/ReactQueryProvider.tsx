'use client';

import React, {PropsWithChildren} from 'react';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';
import {getQueryClient} from '@/utils/extend/library/react-query';
import {QueryClientProvider} from '@tanstack/react-query';

// Doc: [RQ 셋팅방법] https://docs.google.com/document/d/1lpn4oe63VfJEbsuNp0WdgWRypdtHQWkdrJzGdFcu7Ws/edit
export default function ReactQueryProvider({children}: PropsWithChildren) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false}/>
    </QueryClientProvider>
  );
}
