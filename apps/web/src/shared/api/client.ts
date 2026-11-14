import 'client-only';
import {getSession} from 'next-auth/react';
import {createApiClient} from '@/shared/api/api-client';

export const apiClient = createApiClient(async () => (await getSession({broadcast: false}))?.appToken);
