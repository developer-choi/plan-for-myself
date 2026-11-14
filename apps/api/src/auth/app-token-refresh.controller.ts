import {CurrentUser, TokenService} from '@nestjs/authentication';
import {Controller, HttpCode, HttpStatus, Post} from '@nestjs/common';
import {ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse} from '@nestjs/swagger';
import {
  type AppTokenClaims,
  type PostAppTokenRefreshApiResponse,
  postAppTokenRefreshApiResponseSchema,
} from '@plan-for-myself/shared/auth';
import {API_ERROR_CODES} from '@plan-for-myself/shared/error';
import {apiErrorSchema} from '../openapi/api-error-schema';
import type {UserRow} from '../user/user.repository';
import {APP_TOKEN_TTL_DAYS} from './app-token-ttl';

@ApiTags('app-token')
@ApiBearerAuth()
@Controller('app-token')
export class AppTokenRefreshController {
  constructor(private readonly tokenService: TokenService) {}

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '앱 토큰 갱신',
    description: `살아 있는 사용자의 토큰이면 만료만 ${APP_TOKEN_TTL_DAYS}일 뒤로 다시 잡은 토큰을 준다`,
  })
  @ApiOkResponse({description: '새 앱 토큰', standardSchema: postAppTokenRefreshApiResponseSchema})
  @ApiUnauthorizedResponse({
    description: '토큰이 없거나 틀렸거나, 탈퇴한 사용자다',
    schema: apiErrorSchema([API_ERROR_CODES.UNAUTHORIZED]),
  })
  async refresh(@CurrentUser() user: UserRow): Promise<PostAppTokenRefreshApiResponse> {
    const {accessToken} = await this.tokenService.issue(String(user.id), {
      claims: (user.isGuest ? {isGuest: true} : {}) satisfies AppTokenClaims,
    });
    return {token: accessToken};
  }
}
