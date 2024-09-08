import {customFetchOnClientSide, customFetchOnServerSide} from '@/utils/extend/fetch';
import type {CheckableHabit, Habit, SubHabit} from '@/types/habit';


export async function getHabitListApi() {
  return customFetchOnServerSide('/api/habit/today', {
    method: 'GET',
    authorize: 'private',
  });
}

export interface PostHabitRequest extends Omit<Habit, 'pk' | 'not_achieve_price' | 'has_important' | 'children'>, Partial<Pick<Habit, 'not_achieve_price'>> {
  children: SubHabit[];
}

export async function postHabitApi(habit: PostHabitRequest, isImportant = true) {
  const {not_achieve_price, achieve_price, title, frequency, content} = habit;

  return customFetchOnClientSide('/api/habit/original', {
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

export async function postTodayCheckHabitApi(checkedHabitList: CheckableHabit[]) {
  return customFetchOnClientSide('/api/habit/today', {
    method: 'POST',
    authorize: 'private',
    body: checkedHabitList
  });
}

export interface UpdateHabitRequest extends PostHabitRequest {
  pk: number;
}

export async function updateHabitApi({pk, ...parameter}: UpdateHabitRequest) {
  return customFetchOnClientSide(`/api/habit/original/${pk}`, {
    method: 'PATCH',
    authorize: 'private',
    body: parameter
  });
}

export async function deleteHabitApi(pk: number) {
  return customFetchOnClientSide(`/api/habit/original/${pk}`, {
    method: 'DELETE',
    authorize: 'private',
  });
}
