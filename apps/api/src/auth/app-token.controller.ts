import {Authenticate, CurrentUser} from '@nestjs/authentication';
import {Body, Controller, HttpCode, HttpStatus, Inject, Post, UnauthorizedException} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  type PostAppTokenApiRequest,
  postAppTokenApiRequestSchema,
  type PostAppTokenApiResponse,
  postAppTokenApiResponseSchema,
} from '@plan-for-myself/shared/auth';
import {API_ERROR_CODES} from '@plan-for-myself/shared/error';
import {apiErrorSchema} from '../openapi/api-error-schema';
import type {UserRow} from '../user/user.repository';
import {GOOGLE_ID_TOKEN_VERIFIER, type GoogleIdTokenVerifier} from './google-id-token.verifier';
import {GoogleLoginService} from './google-login.service';

@ApiTags('app-token')
@Controller('app-token')
export class AppTokenController {
  constructor(
    @Inject(GOOGLE_ID_TOKEN_VERIFIER) private readonly verifier: GoogleIdTokenVerifier,
    private readonly googleLoginService: GoogleLoginService,
  ) {}

  /**
   * @param user null: 앱 토큰 없이 불렀다
   */
  @Post()
  @HttpCode(HttpStatus.OK)
  @Authenticate({optional: true})
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Google idToken을 앱 토큰으로 바꾼다',
    description:
      '게스트 토큰을 Bearer로 함께 보내면 그 게스트를 Google 계정에 잇는다. 기록 있는 게스트가 이미 가입된 계정으로 오면 registered-account로 거절하고, 같은 rejection을 discardIntent로 다시 보내면 게스트 기록을 버리고 그 계정으로 간다',
  })
  @ApiOkResponse({
    description: '앱 토큰, 또는 이미 가입된 계정이라는 거절',
    standardSchema: postAppTokenApiResponseSchema,
  })
  @ApiBadRequestResponse({
    description: '본문이 형식에 맞지 않는다',
    schema: apiErrorSchema([API_ERROR_CODES.INVALID_BODY]),
  })
  @ApiUnauthorizedResponse({
    description: 'Google idToken 검증에 실패했거나, 함께 보낸 앱 토큰이 틀렸거나 탈퇴한 사용자다',
    schema: apiErrorSchema([API_ERROR_CODES.UNAUTHORIZED]),
  })
  @ApiConflictResponse({
    description: '판정 뒤 다른 요청이 그 게스트나 그 Google 계정을 바꿨다. 다시 보내면 바뀐 상태로 다시 판정한다',
    schema: apiErrorSchema([API_ERROR_CODES.LOGIN_CONFLICT]),
  })
  async exchange(
    @CurrentUser() user: UserRow | null,
    @Body({schema: postAppTokenApiRequestSchema}) {idToken, discardIntent}: PostAppTokenApiRequest,
  ): Promise<PostAppTokenApiResponse> {
    const googleSub = await this.verifier.verify(idToken);
    if (googleSub === null) {
      throw new UnauthorizedException();
    }
    return this.googleLoginService.exchange({googleSub, discardIntent, tokenUserId: user?.id ?? null});
  }
}
