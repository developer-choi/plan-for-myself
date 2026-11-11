import {z} from 'zod';

const HS256_MIN_KEY_BYTES = 32;

export const envSchema = z.object({
  AUTH_SECRET: z
    .string({error: 'AUTH_SECRET이 있어야 한다'})
    .refine((secret) => new TextEncoder().encode(secret).byteLength >= HS256_MIN_KEY_BYTES, {
      error: `AUTH_SECRET은 ${HS256_MIN_KEY_BYTES}바이트 이상이어야 한다`,
    }),
});

export type Env = z.infer<typeof envSchema>;
