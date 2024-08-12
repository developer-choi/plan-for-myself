import {PostDailyStudyTimeParameter} from '@/type/studied-time';
import {customFetchInClientSide} from '@/util/extend/api/client';

export async function postStudiedTimeApi(parameter: PostDailyStudyTimeParameter) {
  return customFetchInClientSide('/api/studied-time', {
    method: 'POST',
    authorize: 'private',
    body: parameter
  });
}
