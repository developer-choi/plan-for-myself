import {createAccountApi} from '@plan-for-myself/shared/auth';
import {apiClient} from '@/shared/api/client';

export const accountApi = createAccountApi(apiClient);
