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
import {apiClient} from '@/shared/api/client';

export async function postStudyRecordApi(request: PostStudyRecordApiRequest): Promise<StudyRecord> {
  return apiClient.post<StudyRecord>('/api/study-records', {body: request});
}

export async function patchStudyRecordApi(request: PatchStudyRecordApiRequest): Promise<StudyRecord> {
  const {pk, ...body} = request;
  return apiClient.patch<StudyRecord>(`/api/study-records/${pk}`, {body});
}

export async function deleteStudyRecordApi(request: DeleteStudyRecordApiRequest): Promise<void> {
  return apiClient.delete<void>(`/api/study-records/${request.pk}`);
}

export async function getStudyRecordListApi(request: GetStudyRecordListApiRequest): Promise<StudyRecord[]> {
  return apiClient.get<StudyRecord[]>('/api/study-records', {searchParams: request});
}

export async function getStudyRecordStatsOverviewApi(
  request: GetStudyRecordStatsOverviewApiRequest,
): Promise<StudyRecordOverview> {
  return apiClient.get<StudyRecordOverview>('/api/study-record-stats/overview', {searchParams: request});
}

export async function getStudyRecordStatsMonthlyApi(
  request: GetStudyRecordStatsMonthlyApiRequest,
): Promise<StudyRecordMonthly> {
  return apiClient.get<StudyRecordMonthly>('/api/study-record-stats/monthly', {searchParams: request});
}
