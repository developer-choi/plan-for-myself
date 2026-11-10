import {describe, expect, it} from '@jest/globals';
import {readIsGuest, readTokenUserId} from './read-app-token';

describe('readIsGuest()', () => {
  describe('General cases', () => {
    it('게스트 토큰이면 true를 반환해야 한다', () => {
      expect(readIsGuest(createToken({sub: 'user-1', isGuest: true}))).toBe(true);
    });

    it('Google 사용자 토큰이면 false를 반환해야 한다', () => {
      expect(readIsGuest(createToken({sub: 'user-1'}))).toBe(false);
    });
  });

  describe('Edge cases', () => {
    it('사용자 ID에 특수문자가 든 게스트 토큰이면 true를 반환해야 한다', () => {
      const token = createToken({sub: '???~~~>>>', isGuest: true});

      expect(readIsGuest(token)).toBe(true);
    });

    it('JWT 형식이 아닌 문자열이면 false를 반환해야 한다', () => {
      expect(readIsGuest('broken')).toBe(false);
    });

    it('토큰이 없으면 false를 반환해야 한다', () => {
      expect(readIsGuest(null)).toBe(false);
    });
  });
});

describe('readTokenUserId()', () => {
  describe('General cases', () => {
    it('사용자 ID가 든 토큰이면 그 ID를 반환해야 한다', () => {
      expect(readTokenUserId(createToken({sub: 'user-1'}))).toBe('user-1');
    });
  });

  describe('Edge cases', () => {
    it('사용자 ID가 없는 토큰이면 null을 반환해야 한다', () => {
      expect(readTokenUserId(createToken({isGuest: true}))).toBeNull();
    });

    it('JWT 형식이 아닌 문자열이면 null을 반환해야 한다', () => {
      expect(readTokenUserId('broken')).toBeNull();
    });

    it('토큰이 없으면 null을 반환해야 한다', () => {
      expect(readTokenUserId(null)).toBeNull();
    });
  });
});

function createToken(payload: object) {
  return `header.${Buffer.from(JSON.stringify(payload)).toString('base64url')}.signature`;
}
