import {describe, expect, it} from '@jest/globals';
import {pickActiveRejection} from './registered-rejection';

describe('pickActiveRejection()', () => {
  describe('General cases', () => {
    it('유지 시간이 남은 거절이면 그 거절을 반환해야 한다', () => {
      expect(pickActiveRejection({rejection: REJECTION, expiresAt: NOW + 1}, NOW)).toEqual(REJECTION);
    });
  });

  describe('Boundary cases', () => {
    it('유지 시간이 지금 끝나면 null을 반환해야 한다', () => {
      expect(pickActiveRejection({rejection: REJECTION, expiresAt: NOW}, NOW)).toBeNull();
    });
  });

  describe('Edge cases', () => {
    it('유지 시간이 지났으면 null을 반환해야 한다', () => {
      expect(pickActiveRejection({rejection: REJECTION, expiresAt: NOW - 1}, NOW)).toBeNull();
    });

    it('저장된 거절이 없으면 null을 반환해야 한다', () => {
      expect(pickActiveRejection(null, NOW)).toBeNull();
    });
  });
});

const NOW = 1_000;
const REJECTION = {guestUserId: '1', googleSubHash: 'hash'};
