import {parseDateParam} from '@plan-for-myself/shared/date';
import {NextRequest, NextResponse} from 'next/server';
import {getDemoResponse} from '@/demo/demo-response';
import {badRequestResponse} from '@/server/study-record/response';
import {validateMonth} from '@/server/study-record/validate';

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
