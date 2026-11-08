import {describe, expect, it, vi} from 'vitest';
import {ApiResponseError, HTTP_STATUS} from '@developer-choi/utils/api';
import {createQueryClient} from './query-client';

describe('createQueryClient()', () => {
  describe('General cases', () => {
    it('쿼리가 401로 실패하면 onUnauthorized를 불러야 한다', async () => {
      const onUnauthorized = vi.fn();
      const client = createQueryClient(onUnauthorized);
      const error = createResponseError(UNAUTHORIZED_STATUS);

      await expect(client.fetchQuery({queryKey: ['test'], queryFn: rejectWith(error)})).rejects.toBe(error);

      expect(onUnauthorized).toHaveBeenCalledTimes(1);
    });

    it('뮤테이션이 401로 실패하면 onUnauthorized를 불러야 한다', async () => {
      const onUnauthorized = vi.fn();
      const client = createQueryClient(onUnauthorized);
      const error = createResponseError(UNAUTHORIZED_STATUS);
      const mutation = client.getMutationCache().build(client, {mutationFn: rejectWith(error)});

      await expect(mutation.execute(undefined)).rejects.toBe(error);

      expect(onUnauthorized).toHaveBeenCalledTimes(1);
    });
  });

  describe('Boundary cases', () => {
    it('401이 아닌 오류면 onUnauthorized를 부르지 않아야 한다', async () => {
      const onUnauthorized = vi.fn();
      const client = createQueryClient(onUnauthorized);
      const error = createResponseError(HTTP_STATUS.SERVER_ERROR);

      await expect(client.fetchQuery({queryKey: ['test'], queryFn: rejectWith(error)})).rejects.toBe(error);

      expect(onUnauthorized).not.toHaveBeenCalled();
    });
  });
});

function rejectWith(error: Error) {
  return () => Promise.reject(error);
}

function createResponseError(status: number) {
  return new ApiResponseError({method: 'GET', status, url: '/api/example', errorData: null});
}

const UNAUTHORIZED_STATUS = 401;
