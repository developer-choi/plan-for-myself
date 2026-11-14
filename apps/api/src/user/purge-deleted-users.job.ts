import {Injectable, Logger} from '@nestjs/common';
import {Cron, CronExpression} from '@nestjs/schedule';
import {DELETION_GRACE_DAYS} from '@plan-for-myself/shared/auth';
import {UserRepository} from './user.repository';

@Injectable()
export class PurgeDeletedUsersJob {
  private readonly logger = new Logger(PurgeDeletedUsersJob.name);

  constructor(private readonly userRepository: UserRepository) {}

  @Cron(CronExpression.EVERY_DAY_AT_4AM, {timeZone: 'Asia/Seoul'})
  async run(): Promise<void> {
    const before = new Date(Date.now() - DELETION_GRACE_DAYS * MILLISECONDS_PER_DAY);
    const count = await this.userRepository.purgeDeletedUsers(before);
    if (count > 0) {
      this.logger.log(`유예 기간이 지난 탈퇴 계정 ${count}개를 영구 삭제했다`);
    }
  }
}

const MILLISECONDS_PER_DAY = 86_400_000;
