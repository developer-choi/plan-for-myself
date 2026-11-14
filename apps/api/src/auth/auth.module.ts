import {Module} from '@nestjs/common';
import {ThrottlerModule} from '@nestjs/throttler';
import {UserModule} from '../user/user.module';
import {AppTokenController} from './app-token.controller';
import {AppTokenProvider} from './app-token.provider';
import {AppTokenRefreshController} from './app-token-refresh.controller';
import {GOOGLE_ID_TOKEN_VERIFIER, GoogleAuthLibraryVerifier} from './google-id-token.verifier';
import {GoogleLoginService} from './google-login.service';
import {GuestLoginService} from './guest-login.service';
import {GUEST_THROTTLE} from './guest-throttler.guard';

@Module({
  imports: [UserModule, ThrottlerModule.forRoot({throttlers: [GUEST_THROTTLE], setHeaders: false})],
  controllers: [AppTokenController, AppTokenRefreshController],
  providers: [
    AppTokenProvider,
    GoogleLoginService,
    GuestLoginService,
    {provide: GOOGLE_ID_TOKEN_VERIFIER, useClass: GoogleAuthLibraryVerifier},
  ],
})
export class AuthModule {}
