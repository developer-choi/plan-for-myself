// @vitest-environment node
import {describe, expect, it} from 'vitest';
import {createRegisteredRejection, isDiscardIntentValid} from '@/auth/login-cookies';

const guestUserId = '1';
const googleSub = 'sub-a';

describe('isDiscardIntentValid()', () => {
  describe('General cases', () => {
    describe('기록 삭제를 누른 게스트가', () => {
      it('안내받은 그 계정으로 로그인하면 true를 반환해야 한다', () => {
        const intent = createRegisteredRejection(guestUserId, googleSub);

        expect(isDiscardIntentValid(intent, {guestUserId, googleSub})).toBe(true);
      });
    });
  });

  describe('Edge cases', () => {
    describe('기록 삭제를 누른 게스트가', () => {
      it('안내받은 계정과 다른 구글 계정으로 로그인하면 false를 반환해야 한다', () => {
        const intent = createRegisteredRejection(guestUserId, googleSub);

        expect(isDiscardIntentValid(intent, {guestUserId, googleSub: 'sub-b'})).toBe(false);
      });
    });

    it('기록 삭제를 누르지 않았으면 false를 반환해야 한다', () => {
      expect(isDiscardIntentValid(null, {guestUserId, googleSub})).toBe(false);
    });

    it('다른 게스트가 기록 삭제를 눌렀으면 false를 반환해야 한다', () => {
      const intent = createRegisteredRejection('2', googleSub);

      expect(isDiscardIntentValid(intent, {guestUserId, googleSub})).toBe(false);
    });
  });
});
