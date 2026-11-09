import {
  createStudyRecordApi,
  type GetStudyRecordStatsMonthlyApiRequest,
  type GetStudyRecordStatsOverviewApiRequest,
  type StudyRecordMonthly,
  type StudyRecordOverview,
} from '@plan-for-myself/shared';
import {apiClient} from '@/shared/api/client';

export const studyRecordApi = createStudyRecordApi(apiClient);

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
