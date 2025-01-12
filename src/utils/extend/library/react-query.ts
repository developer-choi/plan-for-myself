import {defaultShouldDehydrateQuery, isServer, QueryClient, UseMutationResult} from '@tanstack/react-query';

// Doc: [RQ 셋팅방법] https://docs.google.com/document/d/1lpn4oe63VfJEbsuNp0WdgWRypdtHQWkdrJzGdFcu7Ws/edit
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        throwOnError: true,
        retry: 0
      },
      dehydrate: {
        // include pending queries in dehydration
        shouldDehydrateQuery: (query) => defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

/**
 * 로딩중인지 여부를 반환.
 * [Mutation 이 성공하고나서 화면이 최신화 될 때까지]를 로딩의 범위로 봐야하는 곳에서만 사용.
 *
 * @example 로그인페이지에서 로그인 성공 후 다른 페이지로 이동이 완료 되기 전까지 내내
 * @example 별도의 Create / Update를 할 수 있는 모달에서 제출이 성공되고 모달이 닫히기 전까지 내내
 *
 * @description
 * 1. 단순히 API 응답이 도착했다고 해서 로딩이 끝났다간, 데이터 최신화 되는 그 잠깐 사이에 버튼을 누를 수 있는 문제도 있고,
 * 2. 1번에서 로딩이 사라지고 나서 그 다음 성공 피드백이 반영되기 전까지가 길어지면 사이트가 느려보이는 느낌도 있음.
 * ==>
 * 그래서 성공피드백이 화면에 반영되기 직전까지 계속 로딩을 보여주기 위함.
 */
export function isLoadingUntilRefresh(result: UseMutationResult<any, any, any, any>) {
  return result.isPending || result.isSuccess;
}
