import {API_ERROR_CODES} from '@plan-for-myself/shared/error';
import {z} from 'zod';

export const GUEST_LIMIT_CODE = API_ERROR_CODES.GUEST_LIMIT;

export type LoginFailure = 'guest-limit' | 'failed';

export function hasGuestLimitCode(errorData: unknown): boolean {
  return guestLimitErrorSchema.safeParse(errorData).success;
}

const guestLimitErrorSchema = z.object({code: z.literal(GUEST_LIMIT_CODE)});
