import {describe, expect, it} from '@jest/globals';
import {shouldSignOutOnUnauthorized} from './unauthorized-sign-out';

describe('shouldSignOutOnUnauthorized()', () => {
  describe('General cases', () => {
    it('401을 받은 토큰이 지금 저장된 토큰이면 true를 반환해야 한다', () => {
      expect(shouldSignOutOnUnauthorized({current: GOOGLE_TOKEN, failed: GOOGLE_TOKEN})).toBe(true);
    });

    it('요청을 보낸 사이 다른 토큰으로 바뀌었으면 false를 반환해야 한다', () => {
      expect(shouldSignOutOnUnauthorized({current: GOOGLE_TOKEN, failed: GUEST_TOKEN})).toBe(false);
    });
  });

  describe('Edge cases', () => {
    describe('저장된 토큰이 있을 때', () => {
      it('어느 토큰으로 보냈는지 모르면 true를 반환해야 한다', () => {
        expect(shouldSignOutOnUnauthorized({current: GOOGLE_TOKEN, failed: undefined})).toBe(true);
      });

      it('토큰 없이 보낸 요청이면 false를 반환해야 한다', () => {
        expect(shouldSignOutOnUnauthorized({current: GOOGLE_TOKEN, failed: null})).toBe(false);
      });
    });

    describe('저장된 토큰이 없을 때', () => {
      it('옛 토큰으로 보낸 요청이면 false를 반환해야 한다', () => {
        expect(shouldSignOutOnUnauthorized({current: null, failed: GUEST_TOKEN})).toBe(false);
      });

      it('어느 토큰으로 보냈는지 모르면 false를 반환해야 한다', () => {
        expect(shouldSignOutOnUnauthorized({current: null, failed: undefined})).toBe(false);
      });

      it('토큰 없이 보낸 요청이면 false를 반환해야 한다', () => {
        expect(shouldSignOutOnUnauthorized({current: null, failed: null})).toBe(false);
      });
    });
  });
});

const GUEST_TOKEN = 'guest-token';
const GOOGLE_TOKEN = 'google-token';
