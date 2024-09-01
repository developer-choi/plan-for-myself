import {customFetchOnClientSide, customFetchOnServerSide} from '@/utils/extend/fetch';
import type {CheckableHabit, Habit} from '@/types/habit';


export async function getHabitListApi() {
  return customFetchOnServerSide('/api/habit/today', {
    method: 'GET',
    authorize: 'private',
  });
}

export type PostHabitRequestParameter = Omit<Habit, 'pk' | 'not_achieve_price' | 'is_important'> & Partial<Pick<Habit, 'not_achieve_price'>>;

export async function postHabitApi(habit: PostHabitRequestParameter, isImportant = true) {
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

export async function updateHabitApi({pk, ...parameter}: PostHabitRequestParameter & {pk: number}) {
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
