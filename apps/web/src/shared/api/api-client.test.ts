// @vitest-environment node
import {describe, expect, it} from 'vitest';
import {toRequestContext} from '@/shared/api/api-client';
import {API_URL} from '@/shared/api/api-url';

describe('toRequestContext()', () => {
  describe('General cases', () => {
    it('앱 토큰이 있으면 Bearer 헤더를 붙여야 한다', () => {
      const appToken = 'app-token';

      expect(toRequestContext(appToken)).toEqual({
        prefixUrl: API_URL,
        headers: [['Authorization', `Bearer ${appToken}`]],
      });
    });
  });

  describe('Edge cases', () => {
    it('앱 토큰이 없으면 Authorization 헤더를 붙이지 않아야 한다', () => {
      expect(toRequestContext(undefined).headers).toBeUndefined();
    });
  });
});
