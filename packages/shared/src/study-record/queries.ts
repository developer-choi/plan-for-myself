import {queryOptions} from '@tanstack/react-query';
import type {StudyRecordApi} from './api';
import {studyRecordQueryKeys} from './query-keys';

type StudyRecordListApi = Pick<StudyRecordApi, 'getStudyRecordListApi'>;

export function createStudyRecordQueries(api: StudyRecordListApi) {
  const queries = {
    list: {
      key: studyRecordQueryKeys.list,
      options: (month: string) =>
        queryOptions({
          queryKey: queries.list.key(month),
          queryFn: () => api.getStudyRecordListApi({month}),
        }),
    },
  };

  return queries;
}
