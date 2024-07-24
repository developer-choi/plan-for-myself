import {customFetchInClientSide} from '@util/extend/api/client';

export async function postRemindOfMessageApi(message: string) {
  return customFetchInClientSide('/api/remind-of-message', {
    method: 'POST',
    authorize: 'private',
    body: {
      message
    }
  });
}

export async function getRemindOfMessageListApi() {
  return customFetchInClientSide('/api/remind-of-message', {
    method: 'GET',
    authorize: 'private'
  });
}

export interface RemindOfMessageItem {
  id: number;
  message: string;
}

export async function updateRemindOfMessageApi(parameter: RemindOfMessageItem) {
  return customFetchInClientSide('/api/remind-of-message', {
    method: 'PATCH',
    authorize: 'private',
    body: parameter
  });
}

export async function deleteRemindOfMessageApi(id: RemindOfMessageItem['id']) {
  return customFetchInClientSide(`/api/remind-of-message/${id}`, {
    method: 'DELETE',
    authorize: 'private',
  });
}
