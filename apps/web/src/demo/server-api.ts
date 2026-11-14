import 'server-only';
import {createDemoApi} from '@plan-for-myself/shared/demo';
import {createApiClient} from '@/shared/api/api-client';

export const serverDemoApi = createDemoApi(createApiClient(() => Promise.resolve(undefined)));
