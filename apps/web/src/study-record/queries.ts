import {queryOptions} from '@tanstack/react-query';
import {getStudyRecordListApi, getStudyRecordStatsOverviewApi} from '@/study-record/api';

export const studyRecordQueries = {
  list: {
    key: (month: string) => ['study-records', month] as const,
    options: (month: string) =>
      queryOptions({
        queryKey: studyRecordQueries.list.key(month),
        queryFn: () => getStudyRecordListApi({month}),
      }),
  },
};

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
};
