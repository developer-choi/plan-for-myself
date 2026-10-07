import type {StudyRecord, StudyRecordMonthly, StudyRecordOverview} from '@plan-for-myself/shared';
import {api} from '@/shared/api/client';

export interface GetStudyRecordListApiRequest {
  month: string;
}

export interface GetStudyRecordStatsOverviewApiRequest {
  date: string;
}

export interface GetStudyRecordStatsMonthlyApiRequest {
  month: string;
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

export async function getStudyRecordStatsMonthlyApi(
  request: GetStudyRecordStatsMonthlyApiRequest,
): Promise<StudyRecordMonthly> {
  return api.get<StudyRecordMonthly>('/api/study-record-stats/monthly', {searchParams: request});
}
