import {describe, expect, it} from 'vitest';
import {shouldShowRegisteredNotice} from './registered-notice';

describe('shouldShowRegisteredNotice()', () => {
  describe('General cases', () => {
    it('거절당한 그 게스트면 true를 반환해야 한다', () => {
      const guestUserId = '1';
      const rejection = {guestUserId, googleSubHash: 'hash'};

      expect(shouldShowRegisteredNotice(rejection, {userId: guestUserId, isGuest: true})).toBe(true);
    });

    it('거절당한 적이 없으면 false를 반환해야 한다', () => {
      expect(shouldShowRegisteredNotice(null, {userId: '1', isGuest: true})).toBe(false);
    });
  });

  describe('Edge cases', () => {
    it('다른 게스트면 false를 반환해야 한다', () => {
      const rejection = {guestUserId: '1', googleSubHash: 'hash'};

      expect(shouldShowRegisteredNotice(rejection, {userId: '2', isGuest: true})).toBe(false);
    });

    it('게스트가 아니면 false를 반환해야 한다', () => {
      const guestUserId = '1';
      const rejection = {guestUserId, googleSubHash: 'hash'};

      expect(shouldShowRegisteredNotice(rejection, {userId: guestUserId, isGuest: false})).toBe(false);
    });

    it('로그아웃 상태면 false를 반환해야 한다', () => {
      const rejection = {guestUserId: '1', googleSubHash: 'hash'};

      expect(shouldShowRegisteredNotice(rejection, null)).toBe(false);
    });

    it('사용자 ID를 읽지 못했으면 false를 반환해야 한다', () => {
      const rejection = {guestUserId: '1', googleSubHash: 'hash'};

      expect(shouldShowRegisteredNotice(rejection, {userId: null, isGuest: true})).toBe(false);
    });
  });
});
