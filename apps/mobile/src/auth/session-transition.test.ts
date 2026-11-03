import {describe, expect, it} from '@jest/globals';
import {isGuestToGoogleTransition} from './session-transition';

describe('isGuestToGoogleTransition()', () => {
  describe('General cases', () => {
    it('게스트가 구글 사용자가 되면 true를 반환해야 한다', () => {
      expect(isGuestToGoogleTransition(GUEST, GOOGLE_USER)).toBe(true);
    });

    it('게스트 토큰만 갱신되면 false를 반환해야 한다', () => {
      expect(isGuestToGoogleTransition(GUEST, REFRESHED_GUEST)).toBe(false);
    });
  });

  describe('Edge cases', () => {
    it('구글 사용자 토큰이 갱신되면 false를 반환해야 한다', () => {
      expect(isGuestToGoogleTransition(GOOGLE_USER, REFRESHED_GOOGLE_USER)).toBe(false);
    });

    it('게스트가 로그아웃하면 false를 반환해야 한다', () => {
      expect(isGuestToGoogleTransition(GUEST, SIGNED_OUT)).toBe(false);
    });

    it('로그아웃 상태에서 구글로 로그인하면 false를 반환해야 한다', () => {
      expect(isGuestToGoogleTransition(SIGNED_OUT, GOOGLE_USER)).toBe(false);
    });
  });
});

const GUEST = {token: 'guest-token', isGuest: true};
const REFRESHED_GUEST = {token: 'refreshed-guest-token', isGuest: true};
const GOOGLE_USER = {token: 'google-token', isGuest: false};
const REFRESHED_GOOGLE_USER = {token: 'refreshed-google-token', isGuest: false};
const SIGNED_OUT = {token: null, isGuest: false};
