// @vitest-environment node
import {decodeJwt, SignJWT} from 'jose';
import {describe, expect, it} from 'vitest';
import {APP_TOKEN_AUDIENCE} from '@plan-for-myself/shared/auth';
import {
  issueAppToken,
  issueGuestAppToken,
  pickRequestUserId,
  readAppTokenGuestUserId,
  readAppTokenKey,
  readAuthorizationUserId,
  refreshAppToken,
} from '@/auth/app-token';

describe('issueAppToken()', () => {
  describe('General cases', () => {
    it('웹 세션 유지 기간과 같은 30일 뒤에 만료되는 토큰을 반환해야 한다', async () => {
      const {iat, exp} = decodeJwt(await issueAppToken('user-1'));

      expect(Number(exp) - Number(iat)).toBe(THIRTY_DAYS_IN_SECONDS);
    });
  });
});

describe('issueGuestAppToken()', () => {
  describe('General cases', () => {
    it('사용자 ID를 넘기면 그 사용자의 게스트 토큰을 반환해야 한다', async () => {
      const {sub, isGuest} = decodeJwt(await issueGuestAppToken('user-1'));

      expect({sub, isGuest}).toEqual({sub: 'user-1', isGuest: true});
    });

    it('웹 세션 유지 기간과 같은 30일 뒤에 만료되는 토큰을 반환해야 한다', async () => {
      const {iat, exp} = decodeJwt(await issueGuestAppToken('user-1'));

      expect(Number(exp) - Number(iat)).toBe(THIRTY_DAYS_IN_SECONDS);
    });

    it('사용자 ID를 넘기면 그 사용자 ID로 풀리는 토큰을 반환해야 한다', async () => {
      const token = await issueGuestAppToken('user-1');

      expect(await readAuthorizationUserId(`Bearer ${token}`)).toBe('user-1');
    });
  });
});

describe('readAppTokenGuestUserId()', () => {
  describe('General cases', () => {
    it('게스트 토큰이면 그 사용자 ID를 반환해야 한다', async () => {
      const userId = 'user-1';
      const token = await issueGuestAppToken(userId);

      expect(await readAppTokenGuestUserId(`Bearer ${token}`)).toBe(userId);
    });

    it('구글 사용자 토큰이면 null을 반환해야 한다', async () => {
      const token = await issueAppToken('user-1');

      expect(await readAppTokenGuestUserId(`Bearer ${token}`)).toBeNull();
    });
  });

  describe('Edge cases', () => {
    it('서명이 틀린 토큰이면 null을 반환해야 한다', async () => {
      const token = await createTamperedToken();

      expect(await readAppTokenGuestUserId(`Bearer ${token}`)).toBeNull();
    });

    it('authorization이 없으면 null을 반환해야 한다', async () => {
      expect(await readAppTokenGuestUserId(null)).toBeNull();
    });
  });
});

describe('refreshAppToken()', () => {
  describe('General cases', () => {
    it('10일 전에 발급한 토큰이면 같은 사용자의 토큰을 반환해야 한다', async () => {
      const payload = await refreshTenDayOldGuestToken();

      expect(payload.sub).toBe('guest-1');
    });

    it('10일 전에 발급한 게스트 토큰이면 게스트 토큰을 반환해야 한다', async () => {
      const payload = await refreshTenDayOldGuestToken();

      expect(payload.isGuest).toBe(true);
    });

    it('10일 전에 발급한 앱용 토큰이면 앱용 토큰을 반환해야 한다', async () => {
      const payload = await refreshTenDayOldGuestToken();

      expect(payload.aud).toBe(APP_TOKEN_AUDIENCE);
    });

    it('10일 전에 발급한 토큰이면 발급 시각을 지금으로 다시 잡은 토큰을 반환해야 한다', async () => {
      const startedAt = nowInSeconds();
      const issuedAt = startedAt - TEN_DAYS_IN_SECONDS;
      const token = await signGuestToken({issuedAt, expiresAt: issuedAt + THIRTY_DAYS_IN_SECONDS});

      const refreshed = await refreshAppToken(`Bearer ${token}`);

      expect(Number(decodeJwt(refreshed ?? '').iat)).toBeGreaterThanOrEqual(startedAt);
    });

    it('10일 전에 발급한 토큰이면 다시 잡은 발급 시각으로부터 30일 뒤 만료되는 토큰을 반환해야 한다', async () => {
      const {iat, exp} = await refreshTenDayOldGuestToken();

      expect(Number(exp) - Number(iat)).toBe(THIRTY_DAYS_IN_SECONDS);
    });

    it('발급받은 앱용 토큰이면 같은 사용자 ID의 앱용 토큰을 반환해야 한다', async () => {
      const token = await issueAppToken('user-1');

      const refreshed = await refreshAppToken(`Bearer ${token}`);

      expect(await readAuthorizationUserId(`Bearer ${refreshed ?? ''}`)).toBe('user-1');
    });
  });

  describe('Edge cases', () => {
    [
      {
        condition: '만료 시각이 지난 토큰',
        createAuthorization: async () =>
          `Bearer ${await signGuestToken({
            issuedAt: nowInSeconds() - THIRTY_DAYS_IN_SECONDS - ONE_MINUTE_IN_SECONDS,
            expiresAt: nowInSeconds() - ONE_MINUTE_IN_SECONDS,
          })}`,
      },
      {
        condition: '서버가 쓰지 않는 키로 서명한 토큰',
        createAuthorization: async () =>
          `Bearer ${await signGuestToken({
            issuedAt: nowInSeconds(),
            expiresAt: nowInSeconds() + THIRTY_DAYS_IN_SECONDS,
            secret: OTHER_SECRET,
          })}`,
      },
      {
        condition: '사용자 정보가 없는 토큰',
        createAuthorization: async () =>
          `Bearer ${await signGuestToken({
            issuedAt: nowInSeconds(),
            expiresAt: nowInSeconds() + THIRTY_DAYS_IN_SECONDS,
            hasSubject: false,
          })}`,
      },
      {condition: 'authorization 헤더가 없는 요청', createAuthorization: () => Promise.resolve(null)},
      {
        condition: 'Bearer가 아닌 방식으로 보낸 토큰',
        createAuthorization: async () => `Basic ${await issueAppToken('user-1')}`,
      },
    ].forEach(({condition, createAuthorization}) => {
      it(`${condition}이면 null을 반환해야 한다`, async () => {
        expect(await refreshAppToken(await createAuthorization())).toBeNull();
      });
    });
  });
});

describe('readAppTokenKey()', () => {
  describe('Edge cases', () => {
    it('32바이트보다 짧은 비밀값이면 에러를 던져야 한다', () => {
      expect(() => readAppTokenKey('shorter-than-32-bytes')).toThrow('32바이트');
    });
  });
});

describe('readAuthorizationUserId()', () => {
  describe('General cases', () => {
    it('Bearer 방식으로 앱용 토큰을 보내면 그 사용자 ID를 반환해야 한다', async () => {
      const userId = 'user-1';
      const token = await issueAppToken(userId);

      expect(await readAuthorizationUserId(`Bearer ${token}`)).toBe(userId);
    });
  });

  describe('Edge cases', () => {
    [
      {condition: '서명이 바뀐 토큰', createToken: createTamperedToken},
      {
        condition: '앱용이 아닌 대상으로 발급한 토큰',
        createToken: () => signToken({audience: `not-${APP_TOKEN_AUDIENCE}`}),
      },
      {condition: '만료 시각이 없는 토큰', createToken: () => signToken({expires: false})},
      {condition: 'HS256이 아닌 알고리즘으로 서명한 토큰', createToken: () => signToken({algorithm: 'HS512'})},
      {condition: 'JWT 형식이 아닌 문자열', createToken: () => Promise.resolve('abc')},
    ].forEach(({condition, createToken}) => {
      it(`${condition}이면 null을 반환해야 한다`, async () => {
        expect(await readAuthorizationUserId(`Bearer ${await createToken()}`)).toBeNull();
      });
    });

    it('authorization 헤더가 없으면 null을 반환해야 한다', async () => {
      expect(await readAuthorizationUserId(null)).toBeNull();
    });

    it('Bearer가 아닌 방식으로 보내면 null을 반환해야 한다', async () => {
      const token = await issueAppToken('user-1');

      expect(await readAuthorizationUserId(`Basic ${token}`)).toBeNull();
    });

    it('방식 이름이 소문자 bearer면 null을 반환해야 한다', async () => {
      const token = await issueAppToken('user-1');

      expect(await readAuthorizationUserId(`bearer ${token}`)).toBeNull();
    });
  });
});

describe('pickRequestUserId()', () => {
  describe('General cases', () => {
    it('쿠키 세션과 다른 사용자의 앱용 토큰이 함께 오면 쿠키 세션의 사용자 ID를 반환해야 한다', async () => {
      const cookieUserId = 'cookie-user';
      const appToken = await issueAppToken('app-user');

      expect(await pickRequestUserId(cookieUserId, `Bearer ${appToken}`)).toBe(cookieUserId);
    });

    it('쿠키 세션 없이 앱용 토큰만 오면 그 토큰의 사용자 ID를 반환해야 한다', async () => {
      const appUserId = 'app-user';
      const appToken = await issueAppToken(appUserId);

      expect(await pickRequestUserId(null, `Bearer ${appToken}`)).toBe(appUserId);
    });
  });
});

const THIRTY_DAYS_IN_SECONDS = 2_592_000;
const TEN_DAYS_IN_SECONDS = 864_000;
const ONE_MINUTE_IN_SECONDS = 60;
const MILLISECONDS_PER_SECOND = 1000;
const OTHER_SECRET = 'other-auth-secret-for-vitest-only-32bytes';

function nowInSeconds() {
  return Math.floor(Date.now() / MILLISECONDS_PER_SECOND);
}

function signGuestToken({
  issuedAt,
  expiresAt,
  secret = process.env.AUTH_SECRET,
  hasSubject = true,
}: {
  issuedAt: number;
  expiresAt: number;
  secret?: string;
  hasSubject?: boolean;
}) {
  const token = new SignJWT({isGuest: true})
    .setProtectedHeader({alg: 'HS256'})
    .setAudience(APP_TOKEN_AUDIENCE)
    .setIssuedAt(issuedAt)
    .setExpirationTime(expiresAt);
  if (hasSubject) {
    token.setSubject('guest-1');
  }
  return token.sign(readAppTokenKey(secret));
}

async function refreshTenDayOldGuestToken() {
  const issuedAt = nowInSeconds() - TEN_DAYS_IN_SECONDS;
  const token = await signGuestToken({issuedAt, expiresAt: issuedAt + THIRTY_DAYS_IN_SECONDS});
  return decodeJwt((await refreshAppToken(`Bearer ${token}`)) ?? '');
}

function signToken({
  algorithm = 'HS256',
  audience = APP_TOKEN_AUDIENCE,
  expires = true,
}: {
  algorithm?: string;
  audience?: string;
  expires?: boolean;
}) {
  const token = new SignJWT()
    .setProtectedHeader({alg: algorithm})
    .setSubject('user-1')
    .setAudience(audience)
    .setIssuedAt();
  if (expires) {
    token.setExpirationTime('1h');
  }
  return token.sign(readAppTokenKey(process.env.AUTH_SECRET));
}

async function createTamperedToken() {
  const [header, payload, signature] = (await issueAppToken('user-1')).split('.');
  const changedFirstLetter = signature.startsWith('A') ? 'B' : 'A';
  return `${header}.${payload}.${changedFirstLetter}${signature.slice(1)}`;
}
