import type {StudyRecord, StudyRecordOverview} from '@plan-for-myself/shared';
import {api} from '@/shared/api/client';

export interface GetStudyRecordListApiRequest {
  month: string;
}

export interface GetStudyRecordStatsOverviewApiRequest {
  date: string;
}

export async function getStudyRecordListApi(request: GetStudyRecordListApiRequest): Promise<StudyRecord[]> {
  return api.get<StudyRecord[]>('/api/study-records', {searchParams: request});
}

export async function getStudyRecordStatsOverviewApi(
  request: GetStudyRecordStatsOverviewApiRequest,
): Promise<StudyRecordOverview> {
  return api.get<StudyRecordOverview>('/api/study-record-stats/overview', {searchParams: request});
}
