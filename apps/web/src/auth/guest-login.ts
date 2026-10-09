import {createHmac} from 'node:crypto';
import {CredentialsSignin} from 'next-auth';
import {GUEST_LIMIT_CODE} from '@/auth/login-error';
import {pool} from '@/server/db/pool';
import {createGuestUserIdWithinLimit, GuestLimitError, type Queryable} from '@/server/user/repository';

const IP_WITHOUT_HEADER = 'local';

class GuestLimitSignin extends CredentialsSignin {
  code = GUEST_LIMIT_CODE;
}

function hashIp(ip: string) {
  return createHmac('sha256', process.env.AUTH_SECRET ?? '')
    .update(ip)
    .digest('hex');
}

/**
 * @throws {GuestLimitSignin} 같은 IP에서 정해진 시간 안에 만든 게스트가 한도에 닿았을 때
 */
export async function authorizeGuest(request: Request, db: Queryable = pool) {
  const ip = request.headers.get('x-forwarded-for') ?? IP_WITHOUT_HEADER;

  try {
    return {id: await createGuestUserIdWithinLimit(hashIp(ip), db)};
  } catch (error) {
    if (error instanceof GuestLimitError) {
      throw new GuestLimitSignin(error.message, {cause: {err: error}});
    }
    throw error;
  }
}
