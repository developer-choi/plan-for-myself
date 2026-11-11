import {TokenService} from '@nestjs/authentication';
import {ConflictException, Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import type {PostAppTokenApiResponse, RegisteredAccountRejection} from '@plan-for-myself/shared/auth';
import {API_ERROR_CODES, type ApiErrorBody} from '@plan-for-myself/shared/error';
import type {Env} from '../config/env';
import {UserRepository} from '../user/user.repository';
import {decideGoogleLogin, type GoogleLoginFacts} from './google-login';
import {createRegisteredRejection, isDiscardIntentValid} from './registered-rejection';

interface ExchangeParams {
  googleSub: string;
  /** null: 게스트 기록을 버리지 않는 일반 교환이다 */
  discardIntent: RegisteredAccountRejection | null;
  /** null: 앱 토큰 없이 불렀다 */
  tokenUserId: number | null;
}

@Injectable()
export class GoogleLoginService {
  private readonly secret: string;

  constructor(
    config: ConfigService<Env, true>,
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenService,
  ) {
    this.secret = config.get('AUTH_SECRET', {infer: true});
  }

  /**
   * @throws ConflictException 판정 뒤 다른 요청이 그 게스트나 그 Google 계정을 바꿔 쓰기가 실패했을 때
   */
  async exchange({googleSub, discardIntent, tokenUserId}: ExchangeParams): Promise<PostAppTokenApiResponse> {
    const decision = decideGoogleLogin(await this.findFacts({googleSub, discardIntent, tokenUserId}));

    switch (decision.type) {
      case 'reject':
        return {
          type: 'registered-account',
          rejection: createRegisteredRejection(decision.guestUserId, googleSub, this.secret),
        };
      case 'find-or-create':
        return this.session(await this.userRepository.findOrCreateByGoogleSub(googleSub));
      case 'link':
        throwIfRaced(await this.userRepository.linkGuestToGoogle(decision.guestUserId, googleSub));
        return this.session(decision.guestUserId);
      case 'switch-delete-empty-guest':
        throwIfRaced(await this.userRepository.deleteGuestWithoutRecords(decision.guestUserId));
        return this.session(decision.registeredUserId);
      case 'switch-discard-guest':
        throwIfRaced(await this.userRepository.deleteGuestWithRecords(decision.guestUserId));
        return this.session(decision.registeredUserId);
    }
  }

  private async findFacts({googleSub, discardIntent, tokenUserId}: ExchangeParams): Promise<GoogleLoginFacts> {
    if (tokenUserId === null) {
      return NO_GUEST_FACTS;
    }

    const {isStillGuest, guestHasRecords, registeredUserId} = await this.userRepository.findGoogleLoginRows(
      tokenUserId,
      googleSub,
    );
    if (!isStillGuest) {
      return NO_GUEST_FACTS;
    }
    return {
      guestUserId: tokenUserId,
      guestHasRecords,
      registeredUserId,
      discardIntentValid: isDiscardIntentValid(discardIntent, {guestUserId: tokenUserId, googleSub}, this.secret),
    };
  }

  private async session(userId: number): Promise<PostAppTokenApiResponse> {
    const {accessToken} = await this.tokenService.issue(String(userId));
    return {type: 'session', token: accessToken};
  }
}

const LOGIN_CONFLICT: ApiErrorBody = {
  code: API_ERROR_CODES.LOGIN_CONFLICT,
  message: '다른 기기에서 계정이 바뀌어 로그인하지 못했어요. 다시 시도해 주세요',
};

const NO_GUEST_FACTS: GoogleLoginFacts = {
  guestUserId: null,
  guestHasRecords: false,
  registeredUserId: null,
  discardIntentValid: false,
};

/**
 * @throws ConflictException 쓰기가 실패했을 때
 */
function throwIfRaced(written: boolean) {
  if (!written) {
    throw new ConflictException(LOGIN_CONFLICT);
  }
}
