import {customFetchInClientSide} from '@/util/extend/api/client';
import {DailyStudyTime} from '@/type/studied-time';

export type PostDailyStudyTimeParameter = Omit<DailyStudyTime, 'pk'>;

export async function postStudiedTimeApi(parameter: PostDailyStudyTimeParameter) {
  return customFetchInClientSide('/api/studied-time', {
    method: 'POST',
    authorize: 'private',
    body: parameter
  });
}

export type UpdateDailyStudyTimeParameter = DailyStudyTime;

export async function patchStudiedTimeApi(parameter: UpdateDailyStudyTimeParameter) {
  return customFetchInClientSide('/api/studied-time', {
    method: 'PATCH',
    authorize: 'private',
    body: parameter
  });
}

export async function deleteStudiedTimeApi(pk: DailyStudyTime['pk']) {
  return customFetchInClientSide(`/api/studied-time/${pk}`, {
    method: 'DELETE',
    authorize: 'private',
  });
}
