import {AuthenticationRegistry, JwtBearerProvider, type JwtClaims} from '@nestjs/authentication';
import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {APP_TOKEN_AUDIENCE} from '@plan-for-myself/shared/auth';
import {InvalidEnvError} from '../error/invalid-env.error';
import {UserRepository, type UserRow} from '../user/user.repository';

@Injectable()
export class AppTokenProvider extends JwtBearerProvider<UserRow> {
  /**
   * @throws InvalidEnvError AUTH_SECRET이 없거나 32바이트보다 짧을 때
   */
  constructor(
    config: ConfigService,
    private readonly userRepository: UserRepository,
    registry: AuthenticationRegistry,
  ) {
    super({key: readAuthSecret(config), audience: APP_TOKEN_AUDIENCE, clockTolerance: CLOCK_TOLERANCE});
    registry.registerProvider(this);
  }

  protected validate({sub}: JwtClaims): Promise<UserRow | null> | null {
    const userId = readUserId(sub);
    return userId === null ? null : this.userRepository.findById(userId);
  }
}

const CLOCK_TOLERANCE = '30s';
const HS256_MIN_KEY_BYTES = 32;

function readAuthSecret(config: ConfigService): string {
  const secret = config.get<string>('AUTH_SECRET') ?? '';
  if (new TextEncoder().encode(secret).byteLength < HS256_MIN_KEY_BYTES) {
    throw new InvalidEnvError('AUTH_SECRET은 32바이트 이상이어야 한다');
  }
  return secret;
}

/**
 * null: sub가 없거나, 웹이 발급하는 모양이 아니다
 */
function readUserId(sub: string | undefined): number | null {
  if (sub === undefined || !/^[1-9]\d*$/.test(sub)) {
    return null;
  }
  const userId = Number(sub);
  return Number.isSafeInteger(userId) ? userId : null;
}
