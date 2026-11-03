import {gaxios, OAuth2Client} from 'google-auth-library';

/**
 * null: 구글 인증서로 한 검증(서명·aud·만료 등)을 통과하지 못했거나 payload에 sub가 없다
 * @throws AUTH_GOOGLE_ID가 없을 때
 * @throws 구글 인증서를 받지 못했을 때 (GaxiosError)
 */
export async function verifyGoogleIdToken(idToken: string): Promise<string | null> {
  const audience = process.env.AUTH_GOOGLE_ID;

  if (!audience) {
    throw new Error('AUTH_GOOGLE_ID가 없어 구글 ID 토큰의 aud를 검사할 수 없다');
  }

  try {
    const ticket = await client.verifyIdToken({idToken, audience});
    return ticket.getPayload()?.sub ?? null;
  } catch (error) {
    if (error instanceof gaxios.GaxiosError) {
      throw error;
    }
    return null;
  }
}

const client = new OAuth2Client();
