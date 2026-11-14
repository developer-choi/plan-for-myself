import type {ApiClient} from '@developer-choi/utils/api';
import type {GetDemoApiRequest, GetDemoApiResponse} from './type';

export function createDemoApi(apiClient: ApiClient) {
  return {
    getDemoApi: (request: GetDemoApiRequest): Promise<GetDemoApiResponse> =>
      apiClient.get<GetDemoApiResponse>('/api/demo', {searchParams: request}),
  };
}
