'use client';

import {customFetchInBothSide, ExtendedCustomFetchParameter} from '@/util/extend/api/both';
import {getSession} from '@/util/sevices/auth';

export async function customFetchInClientSide(input: string | URL | globalThis.Request, parameter: ExtendedCustomFetchParameter) {
  const session = getSession();
  return await customFetchInBothSide(input, {...parameter, session});
}
