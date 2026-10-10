import {getKoreanToday} from '@plan-for-myself/shared';
import {NextRequest, NextResponse} from 'next/server';
import {getRequestUserId} from '@/auth/request-user';
import {createStudyRecord, listStudyRecords} from '@/server/study-record/repository';
import {createdResponse, unauthorizedResponse} from '@/server/response';
import {badRequestResponse, duplicateDateResponse} from '@/server/study-record/response';
import {readJsonBody, validateMonth, validateNewStudyRecord} from '@/server/study-record/validate';

export async function GET(request: NextRequest) {
  const userId = await getRequestUserId();
  if (!userId) {
    return unauthorizedResponse();
  }

  const range = validateMonth(request.nextUrl.searchParams.get('month'));
  if (!range.ok) {
    return badRequestResponse(range.rejection);
  }

  return NextResponse.json(await listStudyRecords(userId, range.value));
}

export async function POST(request: NextRequest) {
  const userId = await getRequestUserId();
  if (!userId) {
    return unauthorizedResponse();
  }

  const record = validateNewStudyRecord(await readJsonBody(request), getKoreanToday());
  if (!record.ok) {
    return badRequestResponse(record.rejection);
  }

  const created = await createStudyRecord(userId, record.value);
  if (created.ok) {
    return createdResponse(created.record);
  }

  /* 탈퇴한 사용자의 쿠키가 다른 기기에 남아 있으면 세션은 풀리지만 사용자 행이 없다. 다시 로그인하게 401로 돌려준다 */
  return created.reason === 'USER_NOT_FOUND' ? unauthorizedResponse() : duplicateDateResponse();
}
