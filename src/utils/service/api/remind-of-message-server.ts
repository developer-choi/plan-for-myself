import {RemindOfMessageItem} from '@/utils/service/api/remind-of-message';
import {fetchFromServer} from '@/utils/extend/library/fetch/fromServer';

export async function getRemindOfMessageListApiOnServer() {
  const {data} = await fetchFromServer<RemindOfMessageItem[]>('/api/remind-of-message', {
    method: 'GET',
    authPolicy: 'private'
  });

  return data;
}
