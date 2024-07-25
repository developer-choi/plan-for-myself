'use client';

import {customFetchInBothSide, ExtendedCustomFetchParameter} from '@/util/extend/api/both';
import {getSession, signOut} from 'next-auth/react';
import {LoginError} from '@/util/sevices/auth/redirect';

export async function customFetchInClientSide(input: string | URL | globalThis.Request, parameter: ExtendedCustomFetchParameter) {
  try {
    const session = await getSession();
    return await customFetchInBothSide(input, {...parameter, session});
  } catch (error: any) {
    if (error instanceof LoginError) {
      const redirectUrl = location.pathname + location.search;

      await signOut({
        redirect: false
      });

      throw new LoginError("Login is required", `/guest/login?redirect=${encodeURIComponent(redirectUrl)}`);
    } else {
      throw error;
    }
  }
}
