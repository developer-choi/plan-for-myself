// @vitest-environment node
import {describe, expect, it} from 'vitest';
import {createLoginCookieValue, isDiscardIntentValid, shouldShowRegisteredNotice} from '@/auth/login-cookies';

const guestUserId = '1';
const googleSub = 'sub-a';

describe('isDiscardIntentValid()', () => {
  it('기록 삭제를 누른 게스트가 안내받은 그 계정으로 로그인하면 게스트 기록을 지우고 로그인한다', () => {
    const intent = createLoginCookieValue(guestUserId, googleSub);

    expect(isDiscardIntentValid(intent, {guestUserId, googleSub})).toBe(true);
  });

  it('기록 삭제를 누르지 않았으면 게스트 기록을 지우지 않는다', () => {
    expect(isDiscardIntentValid(null, {guestUserId, googleSub})).toBe(false);
  });

  it('다른 게스트가 기록 삭제를 눌렀어도 이 게스트의 기록은 지우지 않는다', () => {
    const intent = createLoginCookieValue('2', googleSub);

    expect(isDiscardIntentValid(intent, {guestUserId, googleSub})).toBe(false);
  });

  it('안내받은 계정과 다른 구글 계정으로 로그인하면 게스트 기록을 지우지 않는다', () => {
    const intent = createLoginCookieValue(guestUserId, googleSub);

    expect(isDiscardIntentValid(intent, {guestUserId, googleSub: 'sub-b'})).toBe(false);
  });
});

describe('shouldShowRegisteredNotice()', () => {
  const rejection = {guestUserId, googleSubHash: 'hash'};

  it('가입된 계정이라 로그인을 거절당한 그 게스트에게 안내를 띄운다', () => {
    expect(shouldShowRegisteredNotice(rejection, {userId: guestUserId, isGuest: true})).toBe(true);
  });

  it('로그인을 거절당한 적 없는 게스트에게는 안내를 띄우지 않는다', () => {
    expect(shouldShowRegisteredNotice(null, {userId: guestUserId, isGuest: true})).toBe(false);
  });

  it('다른 게스트가 거절당한 기록으로는 안내를 띄우지 않는다', () => {
    expect(shouldShowRegisteredNotice(rejection, {userId: '2', isGuest: true})).toBe(false);
  });

  it('이미 게스트가 아닌 사용자에게는 거절당한 기록이 같은 ID여도 안내를 띄우지 않는다', () => {
    expect(shouldShowRegisteredNotice(rejection, {userId: guestUserId, isGuest: false})).toBe(false);
  });

  it('로그아웃 상태면 거절당한 기록이 있어도 안내를 띄우지 않는다', () => {
    expect(shouldShowRegisteredNotice(rejection, null)).toBe(false);
  });
});
