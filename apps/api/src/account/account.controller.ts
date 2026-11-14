import {CurrentUser} from '@nestjs/authentication';
import {Controller, Delete, HttpCode, HttpStatus} from '@nestjs/common';
import {ApiBearerAuth, ApiNoContentResponse, ApiTags, ApiUnauthorizedResponse} from '@nestjs/swagger';
import {DELETION_GRACE_DAYS} from '@plan-for-myself/shared/auth';
import {API_ERROR_CODES} from '@plan-for-myself/shared/error';
import {apiErrorSchema} from '../openapi/api-error-schema';
import {UserRepository, type UserRow} from '../user/user.repository';

@ApiTags('account')
@ApiBearerAuth()
@Controller('account')
export class AccountController {
  constructor(private readonly userRepository: UserRepository) {}

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: `Google 계정은 탈퇴 표시를 두어 이 토큰을 거부하고, ${DELETION_GRACE_DAYS}일 안에 다시 로그인하면 되살린다. 그 뒤 사용자 행과 기록을 모두 지운다. 게스트는 사용자 행과 기록을 바로 지운다`,
  })
  @ApiUnauthorizedResponse({
    description: '토큰이 없거나 틀렸거나, 탈퇴한 사용자다',
    schema: apiErrorSchema([API_ERROR_CODES.UNAUTHORIZED]),
  })
  async delete(@CurrentUser() user: UserRow): Promise<void> {
    if (user.isGuest && (await this.userRepository.deleteGuestWithRecords(user.id))) {
      return;
    }
    await this.userRepository.markDeleted(user.id);
  }
}
