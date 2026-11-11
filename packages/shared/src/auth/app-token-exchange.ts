import {z} from 'zod';
import {registeredAccountRejectionSchema} from './registered-rejection';

export type PostAppTokenApiRequest = z.infer<typeof postAppTokenApiRequestSchema>;

export type PostAppTokenApiResponse = z.infer<typeof postAppTokenApiResponseSchema>;

export type PostAppTokenGuestApiResponse = z.infer<typeof postAppTokenGuestApiResponseSchema>;

export const postAppTokenApiRequestSchema = z.object(
  {
    idToken: z.jwt({error: 'idToken은 JWT 형식으로 보내 주세요'}),
    /** null: 게스트 기록을 버리지 않는 일반 교환이다 */
    discardIntent: registeredAccountRejectionSchema.nullable(),
  },
  {error: '요청 형식이 올바르지 않아요'},
);

export const postAppTokenApiResponseSchema = z.discriminatedUnion('type', [
  z.object({type: z.literal('session'), token: z.jwt()}),
  z.object({type: z.literal('registered-account'), rejection: registeredAccountRejectionSchema}),
]);

export const postAppTokenGuestApiResponseSchema = z.object({token: z.jwt()});
