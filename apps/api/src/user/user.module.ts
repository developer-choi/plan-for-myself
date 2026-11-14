import {Module} from '@nestjs/common';
import {DatabaseModule} from '../db/database.module';
import {PurgeDeletedUsersJob} from './purge-deleted-users.job';
import {UserRepository} from './user.repository';

@Module({
  imports: [DatabaseModule],
  providers: [UserRepository, PurgeDeletedUsersJob],
  exports: [UserRepository],
})
export class UserModule {}
