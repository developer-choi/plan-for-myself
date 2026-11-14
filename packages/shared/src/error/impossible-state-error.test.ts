import {BaseError} from '@developer-choi/utils/api';
import {describe, expect, it} from 'vitest';
import {ImpossibleStateError} from './impossible-state-error';

describe('ImpossibleStateError', () => {
  describe('General cases', () => {
    it('Sentry가 심각도를 읽는 BaseError여야 한다', () => {
      expect(new ImpossibleStateError('상태')).toBeInstanceOf(BaseError);
    });

    it('로그 첫 줄에 클래스 이름과 문구를 남겨야 한다', () => {
      expect(String(new ImpossibleStateError('상태'))).toBe('ImpossibleStateError: 상태');
    });
  });
});
