import type {PostGoalRequestParameter} from '@type/goal-server';
import {othersCustomFetch} from '@util/extend/api/both';
import {getSession} from '@util/sevices/auth';
import {getCustomFetchInClientSide} from '@util/extend/api/client';
import type {CheckableGoal, Goal} from '@type/goal';

export async function postGoalApi(goal: PostGoalRequestParameter, isImportant = true) {
  const {not_achieve_price, achieve_price, title, frequency, content} = goal;

  return othersCustomFetch('/api/original-goal', {
    method: 'POST',
    session: getSession(),
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
  return othersCustomFetch('/api/original-goal/multiple', {
    method: 'POST',
    session: getSession(),
    body: originalGoalList
  });
}

export async function postTodayCheckGoalApi(checkedGoalList: CheckableGoal[]) {
  return othersCustomFetch('/api/today-goal', {
    method: 'POST',
    session: getSession(),
    body: checkedGoalList
  });
}

export async function getGoalListApi() {
  return getCustomFetchInClientSide('/api/today-goal');
}

export async function updateGoalApi(pk: number, parameter: PostGoalRequestParameter) {
  return othersCustomFetch(`/api/original-goal/${pk}`, {
    method: 'PATCH',
    session: getSession(),
    body: parameter
  });
}

export async function deleteGoalApi(pk: number) {
  return othersCustomFetch(`/api/original-goal/${pk}`, {
    method: 'DELETE',
    session: getSession()
  });
}
