import {NextRequest, NextResponse} from 'next/server';
import {getRequestUserId} from '@/auth/request-user';
import {listStudyRecords} from '@/server/study-record/repository';
import {unauthorizedResponse} from '@/server/response';
import {badRequestResponse} from '@/server/study-record/response';
import {validateDate, validateMonth, validateNotFutureMonth} from '@/server/study-record/validate';
import {toMonth} from '@/server/study-record-stats/date';
import {calculateMonthly} from '@/server/study-record-stats/monthly';

/* 전달 비교와 첫 기록 달 판정이 그 달 밖의 기록을 보므로 그 달만이 아니라 본인 기록 전체를 읽는다 */
export async function GET(request: NextRequest) {
  const userId = await getRequestUserId();
  if (!userId) {
    return unauthorizedResponse();
  }

  const month = validateMonth(request.nextUrl.searchParams.get('month'));
  if (!month.ok) {
    return badRequestResponse(month.rejection);
  }

  const date = validateDate(request.nextUrl.searchParams.get('date'));
  if (!date.ok) {
    return badRequestResponse(date.rejection);
  }

  const notFutureMonth = validateNotFutureMonth(month.value, date.value);
  if (!notFutureMonth.ok) {
    return badRequestResponse(notFutureMonth.rejection);
  }

  const records = await listStudyRecords(userId, null);
  return NextResponse.json(calculateMonthly(records, toMonth(month.value.from), date.value));
}
