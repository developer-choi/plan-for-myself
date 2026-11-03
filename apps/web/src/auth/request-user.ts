import {headers} from 'next/headers';
import {pickRequestUserId} from '@/auth/app-token';
import {auth} from '@/auth/next-auth';

/**
 * null: 쿠키 세션도 유효한 앱용 토큰도 없다
 */
export async function getRequestUserId(): Promise<string | null> {
  const session = await auth();
  return pickRequestUserId(session?.userId ?? null, (await headers()).get('authorization'));
}
