import {createStudyRecordQueries} from '@plan-for-myself/shared';
import {queryOptions} from '@tanstack/react-query';
import {getStudyRecordStatsMonthlyApi, getStudyRecordStatsOverviewApi, studyRecordApi} from '@/study-record/api';

export const studyRecordQueries = createStudyRecordQueries(studyRecordApi);

export const studyRecordStatsQueries = {
  all: {
    key: () => ['study-record-stats'] as const,
  },
  overview: {
    key: (date: string) => [...studyRecordStatsQueries.all.key(), 'overview', date] as const,
    options: (date: string) =>
      queryOptions({
        queryKey: studyRecordStatsQueries.overview.key(date),
        queryFn: () => getStudyRecordStatsOverviewApi({date}),
      }),
  },
  monthly: {
    key: (month: string, date: string) => [...studyRecordStatsQueries.all.key(), 'monthly', month, date] as const,
    options: (month: string, date: string) =>
      queryOptions({
        queryKey: studyRecordStatsQueries.monthly.key(month, date),
        queryFn: () => getStudyRecordStatsMonthlyApi({month, date}),
      }),
  },
};
