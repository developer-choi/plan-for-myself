import {getKoreanToday} from '@plan-for-myself/shared/date';
import {validateDate} from '@plan-for-myself/shared/study-record';
import {calculateOverview} from '@plan-for-myself/shared/study-record-stats';
import {NextRequest, NextResponse} from 'next/server';
import {getRequestUserId} from '@/auth/request-user';
import {listStudyRecords} from '@/server/study-record/repository';
import {unauthorizedResponse} from '@/server/response';
import {badRequestResponse} from '@/server/study-record/response';

export async function GET(request: NextRequest) {
  const userId = await getRequestUserId();
  if (!userId) {
    return unauthorizedResponse();
  }

  const date = validateDate(request.nextUrl.searchParams.get('date'), getKoreanToday());
  if (!date.ok) {
    return badRequestResponse(date.rejection);
  }

  return NextResponse.json(calculateOverview(await listStudyRecords(userId, null), date.value));
}
