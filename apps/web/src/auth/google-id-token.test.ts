// @vitest-environment node
import {describe, expect, it} from 'vitest';
import {verifyGoogleIdToken} from '@/auth/google-id-token';

describe('verifyGoogleIdToken()', () => {
  describe('Edge cases', () => {
    it('구글 로그인용 클라이언트 ID 설정이 없으면 에러를 던져야 한다', async () => {
      await expect(verifyGoogleIdToken('id-token-1')).rejects.toThrow('AUTH_GOOGLE_ID');
    });
  });
});
