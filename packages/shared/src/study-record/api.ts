import type {ApiClient} from '@developer-choi/utils/api';
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
} from './type';

export type StudyRecordApi = ReturnType<typeof createStudyRecordApi>;

export function createStudyRecordApi(apiClient: ApiClient) {
  return {
    postStudyRecordApi: (request: PostStudyRecordApiRequest): Promise<StudyRecord> => {
      return apiClient.post<StudyRecord>('/api/study-records', {body: request});
    },
    patchStudyRecordApi: (request: PatchStudyRecordApiRequest): Promise<StudyRecord> => {
      const {pk, ...body} = request;
      return apiClient.patch<StudyRecord>(`/api/study-records/${pk}`, {body});
    },
    deleteStudyRecordApi: (request: DeleteStudyRecordApiRequest): Promise<void> => {
      return apiClient.delete<void>(`/api/study-records/${request.pk}`);
    },
    getStudyRecordListApi: (request: GetStudyRecordListApiRequest): Promise<StudyRecord[]> => {
      return apiClient.get<StudyRecord[]>('/api/study-records', {searchParams: request});
    },
    getStudyRecordStatsOverviewApi: (request: GetStudyRecordStatsOverviewApiRequest): Promise<StudyRecordOverview> => {
      return apiClient.get<StudyRecordOverview>('/api/study-record-stats/overview', {searchParams: request});
    },
    getStudyRecordStatsMonthlyApi: (request: GetStudyRecordStatsMonthlyApiRequest): Promise<StudyRecordMonthly> => {
      return apiClient.get<StudyRecordMonthly>('/api/study-record-stats/monthly', {searchParams: request});
    },
  };
}
