// @vitest-environment node
import {describe, expect, it} from 'vitest';
import {getLoginErrorKind} from '@/auth/login-error';

describe('getLoginErrorKind()', () => {
  describe('General cases', () => {
    it('게스트 생성 한도에 걸려 로그인 화면으로 돌아오면 게스트 한도 오류를 반환한다', () => {
      expect(getLoginErrorKind({error: 'CredentialsSignin', code: 'guest_limit'})).toBe('guest-limit');
    });

    it('구글 로그인이 실패해 로그인 화면으로 돌아오면 로그인 실패 오류를 반환한다', () => {
      expect(getLoginErrorKind({error: 'OAuthCallbackError'})).toBe('failed');
    });

    it('오류 없이 로그인 화면에 들어오면 null을 반환한다', () => {
      expect(getLoginErrorKind({})).toBeNull();
    });
  });

  describe('Edge cases', () => {
    it('한도 코드만 있는 주소로 들어오면 null을 반환한다', () => {
      expect(getLoginErrorKind({code: 'guest_limit'})).toBeNull();
    });

    it('서버가 모르는 코드를 실어 보내면 로그인 실패 오류를 반환한다', () => {
      expect(getLoginErrorKind({error: 'CredentialsSignin', code: 'unknown_code'})).toBe('failed');
    });

    it('오류 값이 비어 있어도 로그인 실패 오류를 반환한다', () => {
      expect(getLoginErrorKind({error: ''})).toBe('failed');
    });

    it('한도 코드 뒤에 다른 코드가 또 오면 게스트 한도 오류를 반환한다', () => {
      expect(getLoginErrorKind({error: ['CredentialsSignin'], code: ['guest_limit', 'other']})).toBe('guest-limit');
    });

    it('다른 코드 뒤에 한도 코드가 오면 로그인 실패 오류를 반환한다', () => {
      expect(getLoginErrorKind({error: 'CredentialsSignin', code: ['other', 'guest_limit']})).toBe('failed');
    });
  });
});
