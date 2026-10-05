import {NextRequest, NextResponse} from 'next/server';
import {getRequestUserId} from '@/auth/request-user';
import {deleteStudyRecord, updateStudyRecord} from '@/server/study-record/repository';
import {noContentResponse, unauthorizedResponse} from '@/server/response';
import {badRequestResponse, notFoundResponse} from '@/server/study-record/response';
import {parsePk, readJsonBody, validateStudyRecordUpdate} from '@/server/study-record/validate';

interface Context {
  params: Promise<{pk: string}>;
}

export async function PATCH(request: NextRequest, {params}: Context) {
  const userId = await getRequestUserId();
  if (!userId) {
    return unauthorizedResponse();
  }

  const pk = parsePk((await params).pk);
  if (pk === null) {
    return notFoundResponse();
  }

  const fields = validateStudyRecordUpdate(await readJsonBody(request));
  if (!fields.ok) {
    return badRequestResponse(fields.rejection);
  }

  const updated = await updateStudyRecord({userId, pk}, fields.value);
  return updated ? NextResponse.json(updated) : notFoundResponse();
}

export async function DELETE(_request: NextRequest, {params}: Context) {
  const userId = await getRequestUserId();
  if (!userId) {
    return unauthorizedResponse();
  }

  const pk = parsePk((await params).pk);
  if (pk === null || !(await deleteStudyRecord(userId, pk))) {
    return notFoundResponse();
  }

  return noContentResponse();
}
