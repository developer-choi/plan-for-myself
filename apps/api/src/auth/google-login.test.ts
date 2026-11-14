import {describe, expect, it} from 'vitest';
import {decideGoogleLogin, type GoogleLoginFacts} from './google-login';

describe('decideGoogleLogin()', () => {
  describe('General cases', () => {
    describe('게스트 토큰 없이 오면', () => {
      it('그 Google 계정의 사용자를 찾거나 만들라고 반환해야 한다', () => {
        expect(decideGoogleLogin(createFacts({guestUserId: null}))).toEqual({type: 'find-or-create'});
      });
    });

    describe('게스트가 처음 쓰는 Google 계정으로 오면', () => {
      [
        {name: '있어도', guestHasRecords: true},
        {name: '없어도', guestHasRecords: false},
      ].forEach(({name, guestHasRecords}) => {
        it(`게스트 기록이 ${name} 그 게스트를 계정에 이으라고 반환해야 한다`, () => {
          expect(decideGoogleLogin(createFacts({guestHasRecords}))).toEqual({type: 'link', guestUserId: GUEST_ID});
        });
      });
    });

    describe('게스트가 이미 가입된 Google 계정으로 오면', () => {
      it('게스트 기록이 없으면 게스트를 지우고 가입된 계정으로 바꾸라고 반환해야 한다', () => {
        expect(decideGoogleLogin(createFacts({registeredUserId: REGISTERED_ID}))).toEqual({
          type: 'switch-delete-empty-guest',
          guestUserId: GUEST_ID,
          registeredUserId: REGISTERED_ID,
        });
      });

      it('게스트 기록이 있으면 거절을 반환해야 한다', () => {
        expect(decideGoogleLogin(createFacts({guestHasRecords: true, registeredUserId: REGISTERED_ID}))).toEqual({
          type: 'reject',
          guestUserId: GUEST_ID,
        });
      });

      it('게스트 기록을 버리겠다고 확인하면 기록째 게스트를 지우고 가입된 계정으로 바꾸라고 반환해야 한다', () => {
        expect(
          decideGoogleLogin(
            createFacts({guestHasRecords: true, registeredUserId: REGISTERED_ID, discardIntentValid: true}),
          ),
        ).toEqual({type: 'switch-discard-guest', guestUserId: GUEST_ID, registeredUserId: REGISTERED_ID});
      });
    });
  });

  describe('Edge cases', () => {
    describe('게스트 토큰 없이 오면', () => {
      it('게스트 기록을 버리겠다는 확인이 있어도 그 Google 계정의 사용자를 찾거나 만들라고 반환해야 한다', () => {
        expect(decideGoogleLogin(createFacts({guestUserId: null, discardIntentValid: true}))).toEqual({
          type: 'find-or-create',
        });
      });
    });

    describe('기록 있는 게스트가 처음 쓰는 Google 계정으로 오면', () => {
      it('게스트 기록을 버리겠다는 확인이 있어도 그 게스트를 계정에 이으라고 반환해야 한다', () => {
        expect(decideGoogleLogin(createFacts({guestHasRecords: true, discardIntentValid: true}))).toEqual({
          type: 'link',
          guestUserId: GUEST_ID,
        });
      });
    });
  });
});

const GUEST_ID = 10;
const REGISTERED_ID = 20;

function createFacts(overrides: Partial<GoogleLoginFacts> = {}): GoogleLoginFacts {
  return {
    guestUserId: GUEST_ID,
    guestHasRecords: false,
    registeredUserId: null,
    discardIntentValid: false,
    ...overrides,
  };
}
