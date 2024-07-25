import type {CheckableGoal, Goal} from '@/type/goal';
import {customFetchInClientSide} from '@/util/extend/api/client';

export type PostGoalRequestParameter = Omit<Goal, 'pk' | 'not_achieve_price' | 'is_important'> & Partial<Pick<Goal, 'not_achieve_price'>>;

export async function postGoalApi(goal: PostGoalRequestParameter, isImportant = true) {
  const {not_achieve_price, achieve_price, title, frequency, content} = goal;

  return customFetchInClientSide('/api/original-goal', {
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
  return customFetchInClientSide('/api/original-goal/multiple', {
    method: 'POST',
    authorize: 'private',
    body: originalGoalList
  });
}

export async function postTodayCheckGoalApi(checkedGoalList: CheckableGoal[]) {
  return customFetchInClientSide('/api/today-goal', {
    method: 'POST',
    authorize: 'private',
    body: checkedGoalList
  });
}

export async function getGoalListApi() {
  return customFetchInClientSide('/api/today-goal', {
    method: 'GET',
    authorize: 'private',
  });
}

export async function updateGoalApi(pk: number, parameter: PostGoalRequestParameter) {
  return customFetchInClientSide(`/api/original-goal/${pk}`, {
    method: 'PATCH',
    authorize: 'private',
    body: parameter
  });
}

export async function deleteGoalApi(pk: number) {
  return customFetchInClientSide(`/api/original-goal/${pk}`, {
    method: 'DELETE',
    authorize: 'private',
  });
}
