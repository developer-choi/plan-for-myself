import {Module} from '@nestjs/common';
import {UserModule} from '../user/user.module';
import {AppTokenProvider} from './app-token.provider';

@Module({
  imports: [UserModule],
  providers: [AppTokenProvider],
})
export class AuthModule {}
