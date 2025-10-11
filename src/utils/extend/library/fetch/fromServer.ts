import 'server-only';
import {auth} from '@/utils/service/auth';
import {customFetch, FetchOptions} from '@/utils/extend/library/fetch/base';

export async function fetchFromServer<D>(input: string, options: FetchOptions) {
  const session = options.authPolicy === 'none' ? null : await auth();
  return await customFetch<D>(input, options, session);
}
