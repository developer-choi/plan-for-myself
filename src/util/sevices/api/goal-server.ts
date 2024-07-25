import {customFetchInServerSide} from '@/util/extend/api/server';
import {RemindOfMessageItem} from '@/util/sevices/api/remind-of-message';

export async function getGoalListApi() {
  return customFetchInServerSide('/api/today-goal', {
    method: 'GET',
    authorize: 'private',
  });
}

export async function getRemindOfMessageListApiOnServer() {
  const {json} = await customFetchInServerSide('/api/remind-of-message', {
    method: 'GET',
    authorize: 'private'
  });

  return json as RemindOfMessageItem[];
}
