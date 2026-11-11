import {Module} from '@nestjs/common';
import {UserModule} from '../user/user.module';
import {AccountController} from './account.controller';

@Module({
  imports: [UserModule],
  controllers: [AccountController],
})
export class AccountModule {}
