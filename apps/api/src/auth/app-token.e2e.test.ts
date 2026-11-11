import {HttpStatus, type INestApplication} from '@nestjs/common';
import {APP_TOKEN_AUDIENCE, type PostAppTokenApiResponse} from '@plan-for-myself/shared/auth';
import {sql} from 'drizzle-orm';
import {jwtVerify} from 'jose';
import request from 'supertest';
import type {App} from 'supertest/types';
import {afterAll, assert, beforeAll, describe, expect, it} from 'vitest';
import type {DatabaseConnection} from '../db/database';
import {bearer, signTestToken} from '../testing/app-token';
import {createInMemoryConnection, startApp} from '../testing/start-app';
import {findRecordOwners, findUser, insertGoogleUser, insertGuest, insertRecord} from '../testing/users';
import {GOOGLE_ID_TOKEN_VERIFIER, type GoogleIdTokenVerifier} from './google-id-token.verifier';

interface ExchangeOptions {
  googleSub: string;
  authorization?: string;
  discardIntent?: unknown;
}

describe('Google idToken 교환 API', () => {
  beforeAll(async () => {
    connection = await createInMemoryConnection();
    app = await startExchangeApp(connection);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('General cases', () => {
    it('처음 보는 Google 계정이면 그 계정의 사용자 행을 만들어야 한다', async () => {
      const googleSub = 'first-sub';

      const response = await exchange(app, {googleSub});

      const {sub} = await readSessionClaims(response.body);
      expect(await findUser(connection.db, Number(sub))).toEqual({isGuest: false, googleSub});
    });

    it('Google 계정으로 발급한 토큰에는 isGuest가 없어야 한다', async () => {
      const response = await exchange(app, {googleSub: 'no-guest-claim-sub'});

      expect(await readSessionClaims(response.body)).not.toHaveProperty('isGuest');
    });

    it('가입된 Google 계정이면 그 사용자 번호의 토큰을 반환해야 한다', async () => {
      const googleSub = 'returning-sub';
      const registeredId = await insertGoogleUser(connection.db, googleSub);

      const response = await exchange(app, {googleSub});

      expect(await readSessionClaims(response.body)).toMatchObject({sub: String(registeredId)});
    });

    it('게스트 토큰과 처음 보는 Google 계정으로 오면 그 게스트 번호의 토큰을 반환해야 한다', async () => {
      const guestId = await insertGuest(connection.db);

      const response = await exchange(app, {googleSub: 'link-sub', authorization: await guestAuth(guestId)});

      expect(await readSessionClaims(response.body)).toMatchObject({sub: String(guestId)});
    });

    it('게스트 토큰과 처음 보는 Google 계정으로 오면 그 게스트 행이 그 계정에 이어져야 한다', async () => {
      const googleSub = 'linked-row-sub';
      const guestId = await insertGuest(connection.db);

      await exchange(app, {googleSub, authorization: await guestAuth(guestId)});

      expect(await findUser(connection.db, guestId)).toEqual({isGuest: false, googleSub});
    });

    it('기록 없는 게스트가 가입된 계정으로 오면 그 계정의 토큰을 반환해야 한다', async () => {
      const googleSub = 'empty-guest-sub';
      const registeredId = await insertGoogleUser(connection.db, googleSub);
      const guestId = await insertGuest(connection.db);

      const response = await exchange(app, {googleSub, authorization: await guestAuth(guestId)});

      expect(await readSessionClaims(response.body)).toMatchObject({sub: String(registeredId)});
    });

    it('기록 없는 게스트가 가입된 계정으로 오면 게스트 행을 지워야 한다', async () => {
      const googleSub = 'empty-guest-deleted-sub';
      await insertGoogleUser(connection.db, googleSub);
      const guestId = await insertGuest(connection.db);

      await exchange(app, {googleSub, authorization: await guestAuth(guestId)});

      expect(await findUser(connection.db, guestId)).toBeNull();
    });

    it('기록 있는 게스트가 가입된 계정으로 오면 registered-account로 거절해야 한다', async () => {
      const googleSub = 'reject-sub';
      await insertGoogleUser(connection.db, googleSub);
      const guestId = await insertGuestWithRecord();

      const response = await exchange(app, {googleSub, authorization: await guestAuth(guestId)});

      expect(response.body).toEqual({
        type: 'registered-account',
        rejection: {guestUserId: String(guestId), googleSubHash: expect.stringMatching(/^[0-9a-f]{64}$/) as string},
      });
    });

    it('기록 있는 게스트가 가입된 계정으로 와 거절되면 게스트 행을 남겨야 한다', async () => {
      const googleSub = 'reject-kept-sub';
      await insertGoogleUser(connection.db, googleSub);
      const guestId = await insertGuestWithRecord();

      await exchange(app, {googleSub, authorization: await guestAuth(guestId)});

      expect(await findUser(connection.db, guestId)).toEqual({isGuest: true, googleSub: null});
    });

    it('거절에서 받은 rejection을 discardIntent로 다시 보내면 그 계정의 토큰을 반환해야 한다', async () => {
      const googleSub = 'discard-sub';
      const registeredId = await insertGoogleUser(connection.db, googleSub);
      const guestId = await insertGuestWithRecord();

      const response = await discardAndConnect(googleSub, guestId);

      expect(await readSessionClaims(response.body)).toMatchObject({sub: String(registeredId)});
    });

    it('거절에서 받은 rejection을 discardIntent로 다시 보내면 게스트의 기록을 지워야 한다', async () => {
      const googleSub = 'discard-records-sub';
      await insertGoogleUser(connection.db, googleSub);
      const guestId = await insertGuestWithRecord();

      await discardAndConnect(googleSub, guestId);

      expect(await findRecordOwners(connection.db, guestId)).toEqual([]);
    });

    it('거절에서 받은 rejection을 discardIntent로 다시 보내면 가입된 계정의 기록은 남겨야 한다', async () => {
      const googleSub = 'discard-keeps-registered-sub';
      const registeredId = await insertGoogleUser(connection.db, googleSub);
      await insertRecord(connection.db, registeredId);
      const guestId = await insertGuestWithRecord();

      await discardAndConnect(googleSub, guestId);

      expect(await findRecordOwners(connection.db, registeredId)).toEqual([{userId: registeredId}]);
    });

    it('발급한 토큰으로 인증이 필요한 API를 부르면 200을 반환해야 한다', async () => {
      const response = await exchange(app, {googleSub: 'usable-sub'});

      await request(app.getHttpServer())
        .get('/api/study-records?month=2026-10')
        .set('Authorization', bearer(readSessionToken(response.body)))
        .expect(HttpStatus.OK);
    });
  });

  describe('Edge cases', () => {
    it('Google idToken 검증에 실패하면 401 UNAUTHORIZED를 반환해야 한다', async () => {
      const response = await exchange(app, {googleSub: INVALID_GOOGLE_SUB});

      expect({status: response.status, body: response.body as unknown}).toEqual({
        status: HttpStatus.UNAUTHORIZED,
        body: {code: 'UNAUTHORIZED', message: '로그인이 필요해요'},
      });
    });

    [
      {name: 'idToken이 JWT 모양이 아니면', body: {idToken: 'not-a-jwt', discardIntent: null}},
      {name: 'discardIntent가 없으면', body: {idToken: toIdToken('missing-intent-sub')}},
      {
        name: 'discardIntent의 guestUserId가 숫자가 아니면',
        body: {idToken: toIdToken('bad-intent-sub'), discardIntent: {guestUserId: 'x', googleSubHash: 'ab'}},
      },
    ].forEach(({name, body}) => {
      it(`${name} 400 INVALID_BODY를 반환해야 한다`, async () => {
        const response = await request(app.getHttpServer()).post(APP_TOKEN_PATH).send(body);

        expect({status: response.status, code: (response.body as {code: string}).code}).toEqual({
          status: HttpStatus.BAD_REQUEST,
          code: 'INVALID_BODY',
        });
      });
    });

    it('함께 보낸 앱 토큰의 서명이 틀렸으면 401 UNAUTHORIZED를 반환해야 한다', async () => {
      const guestId = await insertGuest(connection.db);
      const token = await signTestToken(String(guestId), {secret: 'another-secret-only-to-break-the-signature'});

      const response = await exchange(app, {googleSub: 'bad-token-sub', authorization: bearer(token)});

      expect({status: response.status, code: (response.body as {code: string}).code}).toEqual({
        status: HttpStatus.UNAUTHORIZED,
        code: 'UNAUTHORIZED',
      });
    });

    it('함께 보낸 게스트 토큰의 사용자가 탈퇴했으면 401 UNAUTHORIZED를 반환해야 한다', async () => {
      const guestId = await insertGuest(connection.db);
      const authorization = await guestAuth(guestId);
      await connection.db.execute(sql`DELETE FROM users WHERE id = ${guestId}`);

      const response = await exchange(app, {googleSub: 'deleted-guest-sub', authorization});

      expect({status: response.status, code: (response.body as {code: string}).code}).toEqual({
        status: HttpStatus.UNAUTHORIZED,
        code: 'UNAUTHORIZED',
      });
    });

    it('Google 사용자의 토큰과 함께 다른 Google 계정으로 오면 그 토큰의 사용자 행을 바꾸지 않아야 한다', async () => {
      const holderSub = 'holder-sub';
      const holderId = await insertGoogleUser(connection.db, holderSub);

      await exchange(app, {googleSub: 'another-sub', authorization: bearer(await signTestToken(String(holderId)))});

      expect(await findUser(connection.db, holderId)).toEqual({isGuest: false, googleSub: holderSub});
    });

    it('같은 게스트가 다른 Google 계정에서 받은 rejection을 discardIntent로 보내면 다시 거절해야 한다', async () => {
      const googleSub = 'intent-target-sub';
      const otherSub = 'intent-other-sub';
      await insertGoogleUser(connection.db, googleSub);
      await insertGoogleUser(connection.db, otherSub);
      const guestId = await insertGuestWithRecord();
      const authorization = await guestAuth(guestId);
      const otherRejected = await exchange(app, {googleSub: otherSub, authorization});

      const response = await exchange(app, {
        googleSub,
        authorization,
        discardIntent: readRejection(otherRejected.body),
      });

      expect((response.body as PostAppTokenApiResponse).type).toBe('registered-account');
    });

    it('다른 게스트의 rejection을 discardIntent로 보내면 다시 거절해야 한다', async () => {
      const googleSub = 'foreign-intent-sub';
      await insertGoogleUser(connection.db, googleSub);
      const guestId = await insertGuestWithRecord();
      const otherGuestId = await insertGuestWithRecord();
      const otherRejected = await exchange(app, {googleSub, authorization: await guestAuth(otherGuestId)});

      const response = await exchange(app, {
        googleSub,
        authorization: await guestAuth(guestId),
        discardIntent: readRejection(otherRejected.body),
      });

      expect((response.body as PostAppTokenApiResponse).type).toBe('registered-account');
    });

    it('판정 뒤 다른 요청이 같은 Google 계정을 먼저 가입시키면 409 LOGIN_CONFLICT를 반환해야 한다', async () => {
      const raceConnection = await createInMemoryConnection();
      const raceApp = await startExchangeApp(raceConnection);
      try {
        const guestId = await insertGuest(raceConnection.db);
        await registerSameGoogleAccountBeforeLink(raceConnection);

        const response = await exchange(raceApp, {googleSub: 'raced-sub', authorization: await guestAuth(guestId)});

        expect({status: response.status, code: (response.body as {code: string}).code}).toEqual({
          status: HttpStatus.CONFLICT,
          code: 'LOGIN_CONFLICT',
        });
      } finally {
        await raceApp.close();
      }
    });
  });
});

const APP_TOKEN_PATH = '/api/app-token';
const INVALID_GOOGLE_SUB = 'invalid';

const fakeVerifier: GoogleIdTokenVerifier = {
  verify: (idToken) => {
    const [, payload = ''] = idToken.split('.');
    const sub = Buffer.from(payload, 'base64url').toString();
    return Promise.resolve(sub === INVALID_GOOGLE_SUB ? null : sub);
  },
};

let connection: DatabaseConnection;
let app: INestApplication<App>;

function startExchangeApp(db: DatabaseConnection) {
  return startApp(db, {overrides: [{provide: GOOGLE_ID_TOKEN_VERIFIER, useValue: fakeVerifier}]});
}

/* z.jwt()를 통과하는 모양이다. 가짜 검증기는 서명을 보지 않는다 */
function toIdToken(googleSub: string) {
  const header = Buffer.from(JSON.stringify({alg: 'RS256', typ: 'JWT'})).toString('base64url');
  return `${header}.${Buffer.from(googleSub).toString('base64url')}.signature`;
}

function exchange(target: INestApplication<App>, {googleSub, authorization, discardIntent = null}: ExchangeOptions) {
  const call = request(target.getHttpServer()).post(APP_TOKEN_PATH);
  if (authorization !== undefined) {
    call.set('Authorization', authorization);
  }
  return call.send({idToken: toIdToken(googleSub), discardIntent});
}

async function discardAndConnect(googleSub: string, guestId: number) {
  const authorization = await guestAuth(guestId);
  const rejected = await exchange(app, {googleSub, authorization});
  return exchange(app, {googleSub, authorization, discardIntent: readRejection(rejected.body)});
}

async function guestAuth(guestId: number) {
  return bearer(await signTestToken(String(guestId)));
}

function readSessionToken(body: unknown): string {
  const response = body as PostAppTokenApiResponse;
  assert(response.type === 'session', `session이 아니라 ${JSON.stringify(body)}를 받았다`);
  return response.token;
}

function readRejection(body: unknown) {
  const response = body as PostAppTokenApiResponse;
  assert(response.type === 'registered-account', `거절이 아니라 ${JSON.stringify(body)}를 받았다`);
  return response.rejection;
}

/* 웹(apps/web/src/auth/app-token.ts)이 앱 토큰을 검증하는 방식 그대로 읽어 웹과 서로 통하는 토큰인지 본다 */
async function readSessionClaims(body: unknown) {
  const {payload} = await jwtVerify(readSessionToken(body), new TextEncoder().encode(process.env.AUTH_SECRET), {
    audience: APP_TOKEN_AUDIENCE,
    algorithms: ['HS256'],
    requiredClaims: ['exp'],
  });
  return payload;
}

async function insertGuestWithRecord() {
  const guestId = await insertGuest(connection.db);
  await insertRecord(connection.db, guestId);
  return guestId;
}

async function registerSameGoogleAccountBeforeLink(target: DatabaseConnection) {
  await target.db.execute(sql`
    CREATE FUNCTION register_before_link() RETURNS trigger AS $$
    BEGIN
      IF OLD.is_guest AND NOT NEW.is_guest THEN
        INSERT INTO users (google_sub, is_guest) VALUES (NEW.google_sub, false);
      END IF;
      RETURN NEW;
    END $$ LANGUAGE plpgsql
  `);
  await target.db.execute(sql`
    CREATE TRIGGER register_before_link BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION register_before_link()
  `);
}
