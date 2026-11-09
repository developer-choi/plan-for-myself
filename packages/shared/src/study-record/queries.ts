import {queryOptions} from '@tanstack/react-query';
import type {StudyRecordApi} from './api';

type StudyRecordListApi = Pick<StudyRecordApi, 'getStudyRecordListApi'>;

export function createStudyRecordQueries(api: StudyRecordListApi) {
  const queries = {
    list: {
      key: (month: string) => ['study-records', month] as const,
      options: (month: string) =>
        queryOptions({
          queryKey: queries.list.key(month),
          queryFn: () => api.getStudyRecordListApi({month}),
        }),
    },
  };

  return queries;
}
