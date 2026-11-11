import {Module} from '@nestjs/common';
import {UserModule} from '../user/user.module';
import {AppTokenController} from './app-token.controller';
import {AppTokenProvider} from './app-token.provider';
import {GOOGLE_ID_TOKEN_VERIFIER, GoogleAuthLibraryVerifier} from './google-id-token.verifier';
import {GoogleLoginService} from './google-login.service';

@Module({
  imports: [UserModule],
  controllers: [AppTokenController],
  providers: [
    AppTokenProvider,
    GoogleLoginService,
    {provide: GOOGLE_ID_TOKEN_VERIFIER, useClass: GoogleAuthLibraryVerifier},
  ],
})
export class AuthModule {}
