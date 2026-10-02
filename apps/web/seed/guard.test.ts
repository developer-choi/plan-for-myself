import {describe, expect, it} from 'vitest';
import {assertDevBranch} from './guard';

describe('assertDevBranch', () => {
  it('개발 branch면 통과한다', () => {
    expect(() => assertDevBranch('br-shy-smoke-a1g8pig9')).not.toThrow();
  });

  it('운영 branch면 거부한다', () => {
    expect(() => assertDevBranch('br-solitary-flower-a19ifvis')).toThrow('시드를 넣지 않는다');
  });

  it('branch ID가 없는 DB(localhost 등)면 거부한다', () => {
    expect(() => assertDevBranch(null)).toThrow('시드를 넣지 않는다');
  });
});
