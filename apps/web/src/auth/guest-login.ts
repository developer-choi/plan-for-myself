import {checkRateLimit} from '@vercel/firewall';
import {CredentialsSignin} from 'next-auth';
import {GUEST_LIMIT_CODE} from '@/auth/login-error';
import {pool} from '@/server/db/pool';
import {createGuestUserId, type Queryable} from '@/server/user/repository';

const GUEST_CREATION_RATE_LIMIT_ID = 'guest-creation';
const RATE_LIMIT_CHECK_TIMEOUT_MS = 3000;

class GuestLimitSignin extends CredentialsSignin {
  code = GUEST_LIMIT_CODE;
}

export type RateLimitCheck = (request: Request) => Promise<boolean>;

export async function isGuestCreationRateLimited(request: Request): Promise<boolean> {
  try {
    const {rateLimited, error} = await checkRateLimit(GUEST_CREATION_RATE_LIMIT_ID, {
      request,
      timeout: RATE_LIMIT_CHECK_TIMEOUT_MS,
    });
    if (error) {
      console.error(`게스트 생성 레이트리밋 확인 결과에 오류가 있다: ${error}`);
    }
    return rateLimited;
  } catch (error) {
    console.error('게스트 생성 레이트리밋을 확인하지 못해 막지 않고 통과시켰다', error);
    return false;
  }
}

/**
 * @throws {GuestLimitSignin} 같은 IP에서 Vercel 방화벽 규칙의 시간 창 안에 만든 게스트가 한도에 닿았거나, 방화벽이 요청을 차단했을 때
 */
export async function authorizeGuest(
  request: Request,
  db: Queryable = pool,
  isRateLimited: RateLimitCheck = isGuestCreationRateLimited,
) {
  if (await isRateLimited(request)) {
    throw new GuestLimitSignin();
  }

  return {id: await createGuestUserId(db)};
}
