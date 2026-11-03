import {MutationCache, QueryCache, QueryClient} from '@tanstack/react-query';
import {isUnauthorizedError} from '../error/unauthorized';

export function createQueryClient(onUnauthorized: (error: Error) => void) {
  function handleError(error: Error) {
    if (isUnauthorizedError(error)) {
      onUnauthorized(error);
    }
  }

  return new QueryClient({
    queryCache: new QueryCache({onError: handleError}),
    mutationCache: new MutationCache({onError: handleError}),
    defaultOptions: {queries: {retry: 0, staleTime: STALE_TIME_MS}},
  });
}

const STALE_TIME_MS = 60_000;
