import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {gaxios, OAuth2Client} from 'google-auth-library';
import type {Env} from '../config/env';

export interface GoogleIdTokenVerifier {
  /**
   * null: Google 인증서로 한 검증(서명·iss·aud·만료)을 통과하지 못했거나 payload에 sub가 없다
   * @throws Google 인증서를 받지 못했을 때
   */
  verify(idToken: string): Promise<string | null>;
}

export const GOOGLE_ID_TOKEN_VERIFIER = Symbol('GOOGLE_ID_TOKEN_VERIFIER');

@Injectable()
export class GoogleAuthLibraryVerifier implements GoogleIdTokenVerifier {
  private readonly client = new OAuth2Client({issuers: GOOGLE_ID_TOKEN_ISSUERS});
  private readonly audience: string;

  constructor(config: ConfigService<Env, true>) {
    this.audience = config.get('AUTH_GOOGLE_ID', {infer: true});
  }

  async verify(idToken: string): Promise<string | null> {
    try {
      const ticket = await this.client.verifyIdToken({idToken, audience: this.audience});
      return ticket.getPayload()?.sub ?? null;
    } catch (error) {
      if (error instanceof gaxios.GaxiosError) {
        throw error;
      }
      return null;
    }
  }
}

const GOOGLE_ID_TOKEN_ISSUERS = ['accounts.google.com', 'https://accounts.google.com'];
