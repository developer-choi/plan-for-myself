import {auth} from '@/utils/service/auth';

/* null: 세션이 없다(로그인하지 않았다) */
export async function getRequestUserId(): Promise<string | null> {
  const session = await auth();
  return session?.userId ?? null;
}
