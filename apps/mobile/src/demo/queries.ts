import {queryOptions} from '@tanstack/react-query';
import {demoApi} from '@/demo/api';

export const demoQueries = {
  thisMonth: {
    key: () => ['demo', 'this-month'] as const,
    options: () =>
      queryOptions({
        queryKey: demoQueries.thisMonth.key(),
        queryFn: () => demoApi.getDemoApi({}),
      }),
  },
  month: {
    key: (month: string) => ['demo', month] as const,
    options: (month: string) =>
      queryOptions({
        queryKey: demoQueries.month.key(month),
        queryFn: () => demoApi.getDemoApi({month}),
      }),
  },
};
