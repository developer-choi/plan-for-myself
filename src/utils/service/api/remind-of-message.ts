import {customFetchOnClientSide} from '@/utils/extend/fetch';

export async function postRemindOfMessageApi(message: string) {
  return customFetchOnClientSide('/api/remind-of-message', {
    method: 'POST',
    authorize: 'private',
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
  return customFetchOnClientSide('/api/remind-of-message', {
    method: 'PATCH',
    authorize: 'private',
    body: parameter
  });
}

export async function deleteRemindOfMessageApi(id: RemindOfMessageItem['id']) {
  return customFetchOnClientSide(`/api/remind-of-message/${id}`, {
    method: 'DELETE',
    authorize: 'private',
  });
}
