import {describe, expect, it} from 'vitest';
import {buildServerRequestContext} from './client';

describe('buildServerRequestContext()', () => {
  describe('General cases', () => {
    it('받은 요청의 프로토콜과 host로 자기 서버 주소를 만들어야 한다', () => {
      const context = buildServerRequestContext({cookie: null, host: 'example.com', protocol: 'https'});

      expect(context.prefixUrl).toBe('https://example.com');
    });

    it('받은 요청의 쿠키를 Cookie 헤더로 실어야 한다', () => {
      const context = buildServerRequestContext({cookie: 'session=abc', host: 'localhost:3000', protocol: 'http'});

      expect(new Headers(context.headers).get('Cookie')).toBe('session=abc');
    });
  });

  describe('Edge cases', () => {
    it('받은 요청에 쿠키가 없으면 Cookie 헤더를 싣지 않아야 한다', () => {
      const context = buildServerRequestContext({cookie: null, host: 'localhost:3000', protocol: 'http'});

      expect(new Headers(context.headers).has('Cookie')).toBe(false);
    });
  });
});
