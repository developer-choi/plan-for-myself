import {GUEST_LIMIT_CODE, type PostAppTokenGuestApiResponse} from '@plan-for-myself/shared/auth';
import {NextRequest, NextResponse} from 'next/server';
import {issueAppTokenForNewGuest} from '@/auth/app-login';
import {HTTP_STATUS, rejectResponse} from '@/server/response';

export async function POST(request: NextRequest) {
  const token = await issueAppTokenForNewGuest(request);
  if (token === null) {
    return rejectResponse(HTTP_STATUS.TOO_MANY_REQUESTS, {
      code: GUEST_LIMIT_CODE,
      message: '게스트가 너무 많이 만들어져 잠시 막았어요',
    });
  }

  return NextResponse.json({token} satisfies PostAppTokenGuestApiResponse);
}
