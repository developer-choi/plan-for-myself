import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {minutes, normalizeIp, ThrottlerGuard} from '@nestjs/throttler';
import {API_ERROR_CODES, type ApiErrorBody} from '@plan-for-myself/shared/error';

interface TrackedRequest {
  headers: Record<string, string | string[] | undefined>;
  /** undefined: 소켓이 이미 닫혔다 */
  ip?: string;
}

export const GUEST_THROTTLE_MINUTES = 10;

export const GUEST_THROTTLE = {name: 'guest', ttl: minutes(GUEST_THROTTLE_MINUTES), limit: 100};

@Injectable()
export class GuestThrottlerGuard extends ThrottlerGuard {
  /* Railway 앞단은 프록시 단 수가 정해져 있지 않아 req.ip가 접속 IP가 아니다. 실제 접속 IP는 Railway가 넣는 X-Real-IP에 있다 */
  protected override getTracker(req: TrackedRequest): Promise<string> {
    const realIp = req.headers['x-real-ip'];
    const ip = typeof realIp === 'string' ? realIp : req.ip;
    return Promise.resolve(ip === undefined ? '' : normalizeIp(ip, this.ipv6SubnetPrefix));
  }

  /**
   * @throws HttpException 429 {code: guest_limit, message}
   */
  protected override throwThrottlingException(): Promise<void> {
    return Promise.reject(new HttpException(GUEST_LIMIT_ERROR, HttpStatus.TOO_MANY_REQUESTS));
  }
}

const GUEST_LIMIT_ERROR: ApiErrorBody = {
  code: API_ERROR_CODES.GUEST_LIMIT,
  message: '게스트가 너무 많이 만들어져 잠시 막았어요',
};
