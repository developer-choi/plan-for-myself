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
  return created.ok ? createdResponse(created.record) : duplicateDateResponse();
}
