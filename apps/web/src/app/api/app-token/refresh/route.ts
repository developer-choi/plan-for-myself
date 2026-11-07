import type {PostAppTokenRefreshApiResponse} from '@plan-for-myself/shared';
import {NextRequest, NextResponse} from 'next/server';
import {refreshAppToken} from '@/auth/app-token';
import {unauthorizedResponse} from '@/server/response';

export async function POST(request: NextRequest) {
  const token = await refreshAppToken(request.headers.get('authorization'));
  if (token === null) {
    return unauthorizedResponse();
  }

  return NextResponse.json({token} satisfies PostAppTokenRefreshApiResponse);
}
