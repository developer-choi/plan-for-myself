import {describe, expect, it} from 'vitest';
import {createRegisteredRejection, isDiscardIntentValid} from './registered-rejection';

describe('isDiscardIntentValid()', () => {
  describe('General cases', () => {
    it('이 게스트가 이 Google 계정으로 받은 가입된 계정 거절 응답이면 true를 반환해야 한다', () => {
      const intent = createRegisteredRejection(GUEST_ID, GOOGLE_SUB, SECRET);

      expect(isDiscardIntentValid(intent, {guestUserId: GUEST_ID, googleSub: GOOGLE_SUB}, SECRET)).toBe(true);
    });
  });

  describe('Edge cases', () => {
    it('다른 Google 계정으로 받은 가입된 계정 거절 응답이면 false를 반환해야 한다', () => {
      const intent = createRegisteredRejection(GUEST_ID, 'other-sub', SECRET);

      expect(isDiscardIntentValid(intent, {guestUserId: GUEST_ID, googleSub: GOOGLE_SUB}, SECRET)).toBe(false);
    });

    it('다른 게스트가 받은 가입된 계정 거절 응답이면 false를 반환해야 한다', () => {
      const intent = createRegisteredRejection(OTHER_GUEST_ID, GOOGLE_SUB, SECRET);

      expect(isDiscardIntentValid(intent, {guestUserId: GUEST_ID, googleSub: GOOGLE_SUB}, SECRET)).toBe(false);
    });

    it('다른 비밀키로 만든 가입된 계정 거절 응답이면 false를 반환해야 한다', () => {
      const intent = createRegisteredRejection(GUEST_ID, GOOGLE_SUB, 'another-secret-of-at-least-32-bytes!!');

      expect(isDiscardIntentValid(intent, {guestUserId: GUEST_ID, googleSub: GOOGLE_SUB}, SECRET)).toBe(false);
    });

    it('googleSubHash 길이가 다르면 false를 반환해야 한다', () => {
      const intent = {guestUserId: String(GUEST_ID), googleSubHash: 'ab'};

      expect(isDiscardIntentValid(intent, {guestUserId: GUEST_ID, googleSub: GOOGLE_SUB}, SECRET)).toBe(false);
    });

    it('가입된 계정 거절 응답을 함께 보내지 않으면 false를 반환해야 한다', () => {
      expect(isDiscardIntentValid(null, {guestUserId: GUEST_ID, googleSub: GOOGLE_SUB}, SECRET)).toBe(false);
    });
  });
});

const GUEST_ID = 10;
const OTHER_GUEST_ID = 11;
const GOOGLE_SUB = 'google-sub';
const SECRET = 'test-secret-of-at-least-32-bytes-long';
