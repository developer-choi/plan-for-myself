import {AuthenticationRegistry, JwtBearerProvider, type JwtClaims} from '@nestjs/authentication';
import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {APP_TOKEN_AUDIENCE} from '@plan-for-myself/shared/auth';
import type {Env} from '../config/env';
import {UserRepository, type UserRow} from '../user/user.repository';

@Injectable()
export class AppTokenProvider extends JwtBearerProvider<UserRow> {
  constructor(
    config: ConfigService<Env, true>,
    private readonly userRepository: UserRepository,
    registry: AuthenticationRegistry,
  ) {
    super({
      key: config.get('AUTH_SECRET', {infer: true}),
      audience: APP_TOKEN_AUDIENCE,
      clockTolerance: CLOCK_TOLERANCE,
    });
    registry.registerProvider(this);
  }

  protected validate({sub}: JwtClaims): Promise<UserRow | null> | null {
    const userId = readUserId(sub);
    return userId === null ? null : this.userRepository.findById(userId);
  }
}

const CLOCK_TOLERANCE = '30s';

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
