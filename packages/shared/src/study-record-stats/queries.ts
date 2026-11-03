import {queryOptions} from '@tanstack/react-query';
import type {StudyRecordApi} from '../study-record/api';
import {studyRecordQueryKeys} from '../study-record/query-keys';

type StudyRecordStatsApi = Pick<StudyRecordApi, 'getStudyRecordStatsOverviewApi' | 'getStudyRecordStatsMonthlyApi'>;

export function createStudyRecordStatsQueries(api: StudyRecordStatsApi) {
  const queries = {
    all: {
      key: studyRecordQueryKeys.stats,
    },
    overview: {
      key: (date: string) => [...queries.all.key(), 'overview', date] as const,
      options: (date: string) =>
        queryOptions({
          queryKey: queries.overview.key(date),
          queryFn: () => api.getStudyRecordStatsOverviewApi({date}),
        }),
    },
    monthly: {
      key: (month: string, date: string) => [...queries.all.key(), 'monthly', month, date] as const,
      options: (month: string, date: string) =>
        queryOptions({
          queryKey: queries.monthly.key(month, date),
          queryFn: () => api.getStudyRecordStatsMonthlyApi({month, date}),
        }),
    },
  };
  return queries;
}
