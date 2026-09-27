import {DailyStudyTime} from '@/types/studied-time';
import {fetchFromClient} from '@/utils/extend/library/fetch/fromClient';

export interface PostDailyStudyTimeParameter extends Omit<DailyStudyTime, 'pk' | 'timestamp'> {
  year: number;
  month: number;
  date: number;
}

export async function postStudiedTimeApi(parameter: PostDailyStudyTimeParameter) {
  return fetchFromClient('/api/studied-time', {
    method: 'POST',
    authPolicy: 'private',
    body: parameter
  });
}

export type UpdateDailyStudyTimeParameter = DailyStudyTime;

export async function patchStudiedTimeApi({pk, ...parameter}: UpdateDailyStudyTimeParameter) {
  return fetchFromClient(`/api/studied-time/${pk}`, {
    method: 'PATCH',
    authPolicy: 'private',
    body: parameter
  });
}

export async function deleteStudiedTimeApi(pk: DailyStudyTime['pk']) {
  return fetchFromClient(`/api/studied-time/${pk}`, {
    method: 'DELETE',
    authPolicy: 'private',
  });
}
