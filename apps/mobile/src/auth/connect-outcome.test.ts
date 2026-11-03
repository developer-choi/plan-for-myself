import {describe, expect, it} from '@jest/globals';
import type {GoogleConnectOutcome} from '@/auth/useGoogleConnect';
import {getConnectOutcomeHref} from './connect-outcome';

describe('getConnectOutcomeHref()', () => {
  describe('General cases', () => {
    it('이미 가입된 Google 계정이라 연결이 거절되면 로그인 화면 주소를 반환해야 한다', () => {
      expect(getConnectOutcomeHref('rejected')).toBe('/sign-in');
    });

    it('실패하면 실패 안내가 붙은 로그인 화면 주소를 반환해야 한다', () => {
      expect(getConnectOutcomeHref('failed')).toEqual({pathname: '/sign-in', params: {error: 'failed'}});
    });

    const nullCases: {condition: string; outcome: GoogleConnectOutcome}[] = [
      {condition: '연결되면', outcome: 'connected'},
      {condition: '취소하면', outcome: 'cancelled'},
      {condition: '이미 가입된 계정 안내가 만료되면', outcome: 'rejection-expired'},
    ];

    nullCases.forEach(({condition, outcome}) => {
      it(`${condition} null을 반환해야 한다`, () => {
        expect(getConnectOutcomeHref(outcome)).toBeNull();
      });
    });
  });
});
