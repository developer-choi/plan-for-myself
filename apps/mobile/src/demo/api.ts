import {createDemoApi} from '@plan-for-myself/shared/demo';
import {apiClient} from '@/shared/api/client';

export const demoApi = createDemoApi(apiClient);
