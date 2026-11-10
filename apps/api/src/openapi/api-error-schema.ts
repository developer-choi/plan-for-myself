import type {ApiErrorCode} from '@plan-for-myself/shared/error';

export function apiErrorSchema(codes: readonly ApiErrorCode[]) {
  return {
    type: 'object',
    required: ['code', 'message'],
    properties: {code: {type: 'string', enum: [...codes]}, message: {type: 'string'}},
  };
}
