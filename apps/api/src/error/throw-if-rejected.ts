import {BadRequestException} from '@nestjs/common';
import type {Rejection} from '@plan-for-myself/shared/study-record';

/**
 * @throws {BadRequestException} 검사가 거절했으면 그 code·message를 본문으로 던진다
 */
export function throwIfRejected(rejection: Rejection | null) {
  if (rejection) {
    throw new BadRequestException(rejection);
  }
}
