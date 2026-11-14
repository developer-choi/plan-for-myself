import 'server-only';
import {cache} from 'react';
import {auth} from '@/auth/next-auth';
import {createApiClient} from '@/shared/api/api-client';

const readServerAppToken = cache(async () => (await auth())?.appToken);

export const serverApiClient = createApiClient(readServerAppToken);
