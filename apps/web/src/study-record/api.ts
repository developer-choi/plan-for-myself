import type {
  DeleteStudyRecordApiRequest,
  GetStudyRecordListApiRequest,
  GetStudyRecordStatsMonthlyApiRequest,
  GetStudyRecordStatsOverviewApiRequest,
  PatchStudyRecordApiRequest,
  PostStudyRecordApiRequest,
  StudyRecord,
  StudyRecordMonthly,
  StudyRecordOverview,
} from '@plan-for-myself/shared';
import {api} from '@/shared/api/client';

export async function postStudyRecordApi(request: PostStudyRecordApiRequest): Promise<StudyRecord> {
  return api.post<StudyRecord>('/api/study-records', {body: request});
}

export async function patchStudyRecordApi(request: PatchStudyRecordApiRequest): Promise<StudyRecord> {
  const {pk, ...body} = request;
  return api.patch<StudyRecord>(`/api/study-records/${pk}`, {body});
}

export async function deleteStudyRecordApi(request: DeleteStudyRecordApiRequest): Promise<void> {
  return api.delete<void>(`/api/study-records/${request.pk}`);
}

export async function getStudyRecordListApi(request: GetStudyRecordListApiRequest): Promise<StudyRecord[]> {
  return api.get<StudyRecord[]>('/api/study-records', {searchParams: request});
}

export async function getStudyRecordStatsOverviewApi(
  request: GetStudyRecordStatsOverviewApiRequest,
): Promise<StudyRecordOverview> {
  return api.get<StudyRecordOverview>('/api/study-record-stats/overview', {searchParams: request});
}

export async function getStudyRecordStatsMonthlyApi(
  request: GetStudyRecordStatsMonthlyApiRequest,
): Promise<StudyRecordMonthly> {
  return api.get<StudyRecordMonthly>('/api/study-record-stats/monthly', {searchParams: request});
}
