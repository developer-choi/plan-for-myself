import {signOut} from '@/auth/next-auth';
import {getRequestUserId} from '@/auth/request-user';
import {noContentResponse, unauthorizedResponse} from '@/server/response';
import {deleteUser} from '@/server/user/repository';

export async function DELETE() {
  const userId = await getRequestUserId();
  if (!userId) {
    return unauthorizedResponse();
  }

  await deleteUser(userId);
  await signOut({redirect: false});
  return noContentResponse();
}
