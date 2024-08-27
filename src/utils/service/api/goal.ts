import {RemindOfMessageItem} from '@/utils/service/api/remind-of-message';
import {customFetchOnClientSide, customFetchOnServerSide} from '@/utils/extend/fetch';
import type {CheckableGoal, Goal} from '@/types/goal';


export async function getGoalListApi() {
  return customFetchOnServerSide('/api/today-goal', {
    method: 'GET',
    authorize: 'private',
  });
}

export async function getRemindOfMessageListApiOnServer() {
  const {json} = await customFetchOnServerSide('/api/remind-of-message', {
    method: 'GET',
    authorize: 'private'
  });

  return json as RemindOfMessageItem[];
}

export type PostGoalRequestParameter = Omit<Goal, 'pk' | 'not_achieve_price' | 'is_important'> & Partial<Pick<Goal, 'not_achieve_price'>>;

export async function postGoalApi(goal: PostGoalRequestParameter, isImportant = true) {
  const {not_achieve_price, achieve_price, title, frequency, content} = goal;

  return customFetchOnClientSide('/api/original-goal', {
    method: 'POST',
    authorize: 'private',
    body: {
      title,
      content,
      achieve_price: achieve_price,
      not_achieve_price: not_achieve_price ?? 0,
      frequency,
      is_important: isImportant
    }
  })
}

export async function postMultipleGoalApi(originalGoalList: Goal[]) {
  return customFetchOnClientSide('/api/original-goal/multiple', {
    method: 'POST',
    authorize: 'private',
    body: originalGoalList
  });
}

export async function postTodayCheckGoalApi(checkedGoalList: CheckableGoal[]) {
  return customFetchOnClientSide('/api/today-goal', {
    method: 'POST',
    authorize: 'private',
    body: checkedGoalList
  });
}

export async function updateGoalApi({pk, ...parameter}: PostGoalRequestParameter & {pk: number}) {
  return customFetchOnClientSide(`/api/original-goal/${pk}`, {
    method: 'PATCH',
    authorize: 'private',
    body: parameter
  });
}

export async function deleteGoalApi(pk: number) {
  return customFetchOnClientSide(`/api/original-goal/${pk}`, {
    method: 'DELETE',
    authorize: 'private',
  });
}

export async function getRemindOfMessageListApiOnClient() {
  const {json} = await customFetchOnClientSide('/api/remind-of-message', {
    method: 'GET',
    authorize: 'private'
  });

  return json as RemindOfMessageItem[];
}
