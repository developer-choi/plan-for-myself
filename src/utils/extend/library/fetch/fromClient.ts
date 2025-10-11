import {isServer} from '@/utils/extend/library/next';
import {getSession, signOut} from 'next-auth/react';
import {customFetch, FetchOptions} from '@/utils/extend/library/fetch/base';
import {InvalidDevelopPolicyError, NotAuthenticatedError} from '@forworkchoe/core/utils';

export async function fetchFromClient<D>(input: string, options: FetchOptions) {
  if(isServer()) {
    throw new InvalidDevelopPolicyError('customFetchOnClientSide()는 Server Side에서 호출되면 안됩니다.');
  }

  try {
    const session = options.authPolicy === 'none' ? null : await getSession();
    return await customFetch<D>(input, options, session);
  } catch (error) {
    if (error instanceof NotAuthenticatedError) {
      const redirectUrl = location.pathname + location.search;

      await signOut({
        redirect: false
      });

      throw new NotAuthenticatedError("Login is required", `/guest/login?redirect=${encodeURIComponent(redirectUrl)}`);
    } else {
      throw error;
    }
  }
}