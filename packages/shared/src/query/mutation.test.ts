import {describe, expect, it} from 'vitest';
import {isMutationSettling} from './mutation';

const IDLE = {isPending: false, isSuccess: false};
const PENDING = {isPending: true, isSuccess: false};
const SUCCESS = {isPending: false, isSuccess: true};

describe('isMutationSettling()', () => {
  describe('General cases', () => {
    it('진행 중인 mutation이면 true를 반환해야 한다', () => {
      expect(isMutationSettling(PENDING)).toBe(true);
    });

    it('성공한 mutation이면 true를 반환해야 한다', () => {
      expect(isMutationSettling(SUCCESS)).toBe(true);
    });

    it('진행 중도 성공도 아닌 mutation이면 false를 반환해야 한다', () => {
      expect(isMutationSettling(IDLE)).toBe(false);
    });
  });

  describe('Edge cases', () => {
    it('여러 mutation 중 하나만 진행 중이면 true를 반환해야 한다', () => {
      expect(isMutationSettling(IDLE, PENDING, IDLE)).toBe(true);
    });
  });
});
