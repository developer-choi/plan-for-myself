import {parseDateParam} from '@plan-for-myself/shared/date';
import {getDemoResponse} from '@plan-for-myself/shared/demo';
import {validateMonth} from '@plan-for-myself/shared/study-record';
import {NextRequest, NextResponse} from 'next/server';
import {badRequestResponse} from '@/server/study-record/response';

export function GET(request: NextRequest) {
  const monthParam = request.nextUrl.searchParams.get('month');
  if (monthParam === null) {
    return NextResponse.json(getDemoResponse(null));
  }

  const month = validateMonth(monthParam);
  if (!month.ok) {
    return badRequestResponse(month.rejection);
  }

  return NextResponse.json(getDemoResponse(parseDateParam(month.value.from)));
}
