import type {GetDemoApiRequest, GetDemoApiResponse} from '@plan-for-myself/shared/demo';
import {apiClient} from '@/shared/api/client';

export const demoApi = {
  getDemoApi: (request: GetDemoApiRequest): Promise<GetDemoApiResponse> =>
    apiClient.get<GetDemoApiResponse>('/api/demo', {searchParams: request}),
};
