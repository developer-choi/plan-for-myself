import {CurrentUser} from '@nestjs/authentication';
import {Controller, Delete, HttpCode, HttpStatus} from '@nestjs/common';
import {ApiBearerAuth, ApiNoContentResponse, ApiTags, ApiUnauthorizedResponse} from '@nestjs/swagger';
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
  @ApiNoContentResponse({description: '내 사용자 행과 기록을 모두 지웠다'})
  @ApiUnauthorizedResponse({
    description: '토큰이 없거나 틀렸거나, 탈퇴한 사용자다',
    schema: apiErrorSchema([API_ERROR_CODES.UNAUTHORIZED]),
  })
  async delete(@CurrentUser() user: UserRow): Promise<void> {
    await this.userRepository.delete(user.id);
  }
}
