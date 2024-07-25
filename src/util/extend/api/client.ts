'use client';

import {customFetchInBothSide, ExtendedCustomFetchParameter} from '@/util/extend/api/both';
import {getSession} from 'next-auth/react';

export async function customFetchInClientSide(input: string | URL | globalThis.Request, parameter: ExtendedCustomFetchParameter) {
  const session = await getSession();
  return await customFetchInBothSide(input, {...parameter, session});
}
