import type {ErrorEvent} from '@sentry/core';
import {ApiRequestError, ApiResponseError} from '@developer-choi/utils/api';
import {describe, expect, it} from 'vitest';
import {beforeSend} from './before-send';

describe('beforeSend()', () => {
  describe('General cases', () => {
    it('401 응답 오류면 null을 반환해야 한다', () => {
      expect(beforeSend(createEvent(), {originalException: createResponseError(UNAUTHORIZED_STATUS)})).toBeNull();
    });

    it('401이 아닌 응답 오류면 받은 event를 반환해야 한다', () => {
      const event = createEvent();

      expect(beforeSend(event, {originalException: createResponseError(SERVER_ERROR_STATUS)})).toBe(event);
    });

    it('BaseError의 level이 low면 level이 info인 event를 반환해야 한다', () => {
      const error = createRequestError({level: 'low'});

      expect(beforeSend(createEvent(), {originalException: error})?.level).toBe('info');
    });

    it('BaseError면 event의 기존 tags에 오류의 tags를 합친 event를 반환해야 한다', () => {
      const eventTags = {runtime: 'app'};
      const errorTags = {feature: 'calendar'};

      const result = beforeSend(createEvent({tags: eventTags}), {
        originalException: createRequestError({tags: errorTags}),
      });

      expect(result?.tags).toEqual({...eventTags, ...errorTags});
    });

    it('일반 오류면 level·tags가 그대로인 event를 반환해야 한다', () => {
      const level = 'error';
      const tags = {runtime: 'app'};

      const result = beforeSend(createEvent({level, tags}), {originalException: new Error('일반 오류')});

      expect(result).toMatchObject({level, tags});
    });

    it('일반 오류면 extra에 그 오류의 stack과 원본을 담은 event를 반환해야 한다', () => {
      const error = new Error('일반 오류');

      expect(beforeSend(createEvent(), {originalException: error})?.extra).toEqual({
        stack: error.stack,
        original: error,
      });
    });
  });

  describe('Edge cases', () => {
    it('오류 객체가 아닌 값이 오면 extra에 stack 없이 원본만 담은 event를 반환해야 한다', () => {
      expect(beforeSend(createEvent(), {originalException: null})?.extra).toEqual({original: null});
    });

    it('event에 extra가 이미 있으면 기존 extra 필드가 남은 event를 반환해야 한다', () => {
      const existingExtra = {screen: 'calendar'};

      const result = beforeSend(createEvent({extra: {...existingExtra}}), {originalException: new Error('일반 오류')});

      expect(result?.extra).toMatchObject(existingExtra);
    });
  });
});

const UNAUTHORIZED_STATUS = 401;
const SERVER_ERROR_STATUS = 500;

function createEvent(fields: Omit<ErrorEvent, 'type'> = {}): ErrorEvent {
  return {type: undefined, ...fields};
}

function createResponseError(status: number) {
  return new ApiResponseError({method: 'GET', status, url: '/api/example', errorData: null});
}

function createRequestError(option: ConstructorParameters<typeof ApiRequestError>[1]) {
  return new ApiRequestError({method: 'GET', url: '/api/example'}, option);
}
