import {z} from 'zod';

const HS256_MIN_KEY_BYTES = 32;
const ORIGIN_ERROR = 'CORS_ORIGINS에 출처(scheme://host[:port])가 아닌 값이 있다';
const originSchema = z.url({error: ORIGIN_ERROR, abort: true}).refine(isOrigin, {error: ORIGIN_ERROR});

export const envSchema = z.object({
  AUTH_SECRET: z
    .string({error: 'AUTH_SECRET이 있어야 한다'})
    .refine((secret) => new TextEncoder().encode(secret).byteLength >= HS256_MIN_KEY_BYTES, {
      error: `AUTH_SECRET은 ${HS256_MIN_KEY_BYTES}바이트 이상이어야 한다`,
    }),
  AUTH_GOOGLE_ID: z.string({error: 'AUTH_GOOGLE_ID가 있어야 한다'}).min(1, {error: 'AUTH_GOOGLE_ID가 비어 있다'}),
  CORS_ORIGINS: z
    .string({error: 'CORS_ORIGINS가 있어야 한다'})
    .transform((value) =>
      value
        .split(',')
        .map((origin) => origin.trim())
        .filter((origin) => origin !== ''),
    )
    .pipe(z.array(originSchema).min(1, {error: 'CORS_ORIGINS가 비어 있다'})),
});

export type Env = z.infer<typeof envSchema>;

function isOrigin(value: string) {
  return URL.canParse(value) && new URL(value).origin === value;
}
