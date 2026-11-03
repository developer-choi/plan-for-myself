import {z} from 'zod';

export const GUEST_LIMIT_CODE = 'guest_limit';

export type LoginFailure = 'guest-limit' | 'failed';

export function hasGuestLimitCode(errorData: unknown): boolean {
  return guestLimitErrorSchema.safeParse(errorData).success;
}

const guestLimitErrorSchema = z.object({code: z.literal(GUEST_LIMIT_CODE)});
