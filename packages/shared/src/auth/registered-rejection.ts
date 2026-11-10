import {z} from 'zod';

export const REGISTERED_REJECTION_TTL_SECONDS = 600;

export type RegisteredAccountRejection = z.infer<typeof registeredAccountRejectionSchema>;

export const registeredAccountRejectionSchema = z.object(
  {
    guestUserId: z
      .string({error: 'guestUserId를 보내 주세요'})
      .regex(/^\d+$/, {error: 'guestUserId가 숫자가 아니에요'}),
    googleSubHash: z.hex({error: 'googleSubHash가 16진수가 아니에요'}),
  },
  {error: '삭제 의도 형식이 올바르지 않아요'},
);
