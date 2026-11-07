import type {PostAppTokenApiRequest, PostAppTokenApiResponse} from '@plan-for-myself/shared';
import {NextRequest, NextResponse} from 'next/server';
import {z} from 'zod';
import {exchangeGoogleIdToken} from '@/auth/app-login';
import {readJsonBody} from '@/server/request';
import {HTTP_STATUS, rejectResponse, unauthorizedResponse} from '@/server/response';

export async function POST(request: NextRequest) {
  const body = exchangeRequestSchema.safeParse(await readJsonBody(request));
  if (!body.success) {
    return rejectResponse(HTTP_STATUS.BAD_REQUEST, {code: 'INVALID_BODY', message: body.error.issues[0].message});
  }

  const token = await exchangeGoogleIdToken(body.data.idToken);
  if (token === null) {
    return unauthorizedResponse();
  }

  return NextResponse.json({token} satisfies PostAppTokenApiResponse);
}

const exchangeRequestSchema = z.object(
  {
    idToken: z.jwt({error: 'idToken은 JWT 형식으로 보내 주세요'}),
  },
  {error: '요청 형식이 올바르지 않아요'},
) satisfies z.ZodType<PostAppTokenApiRequest>;
