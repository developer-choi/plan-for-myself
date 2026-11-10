import {createAccountApi} from '@plan-for-myself/shared';
import {apiClient} from '@/shared/api/client';

export const accountApi = createAccountApi(apiClient);
