import {fetchFromClient} from '@/utils/extend/library/fetch/fromClient';

export async function getRemindOfMessageListApiOnClient() {
  const {data} = await fetchFromClient<RemindOfMessageItem[]>('/api/remind-of-message', {
    method: 'GET',
    authPolicy: 'private'
  });

  return data;
}

export async function postRemindOfMessageApi(message: string) {
  return fetchFromClient('/api/remind-of-message', {
    method: 'POST',
    authPolicy: 'private',
    body: {
      message
    }
  });
}

export interface RemindOfMessageItem {
  id: number;
  message: string;
}

export async function updateRemindOfMessageApi(parameter: RemindOfMessageItem) {
  return fetchFromClient('/api/remind-of-message', {
    method: 'PATCH',
    authPolicy: 'private',
    body: parameter
  });
}

export async function deleteRemindOfMessageApi(id: RemindOfMessageItem['id']) {
  return fetchFromClient(`/api/remind-of-message/${id}`, {
    method: 'DELETE',
    authPolicy: 'private',
  });
}
