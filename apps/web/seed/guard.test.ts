import {describe, expect, it} from 'vitest';
import {assertDevBranch} from './guard';

describe('assertDevBranch()', () => {
  describe('General cases', () => {
    it('개발 DB면 시드를 넣도록 통과시켜야 한다', () => {
      expect(() => assertDevBranch('br-shy-smoke-a1g8pig9')).not.toThrow();
    });

    it('개발 DB가 아니면(운영 DB 등) 시드를 넣지 않도록 거부해야 한다', () => {
      expect(() => assertDevBranch('br-other-branch')).toThrow('시드를 넣지 않는다');
    });
  });

  describe('Edge cases', () => {
    it('어느 DB인지 알 수 없으면(localhost 등) 거부해야 한다', () => {
      expect(() => assertDevBranch(null)).toThrow('시드를 넣지 않는다');
    });
  });
});
