'use client';

import {getSession} from '@util/sevices/auth';
import {getCustomFetchInBothSide, GetFetchParameter} from '@util/extend/api/both';

export async function getCustomFetchInClientSide(input: string | URL | globalThis.Request, parameter?: Omit<GetFetchParameter, 'session'>) {
  const session = await getSession();
  return await getCustomFetchInBothSide(input, {...parameter, session});
}
