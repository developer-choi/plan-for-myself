import {TokenService} from '@nestjs/authentication';
import {Injectable} from '@nestjs/common';
import type {AppTokenClaims, PostAppTokenGuestApiResponse} from '@plan-for-myself/shared/auth';
import {UserRepository} from '../user/user.repository';

@Injectable()
export class GuestLoginService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenService,
  ) {}

  async start(): Promise<PostAppTokenGuestApiResponse> {
    const guestId = await this.userRepository.createGuest();
    const {accessToken} = await this.tokenService.issue(String(guestId), {
      claims: {isGuest: true} satisfies AppTokenClaims,
    });
    return {token: accessToken};
  }
}
