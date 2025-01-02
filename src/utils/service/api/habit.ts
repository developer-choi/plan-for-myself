import {customFetchOnClientSide, customFetchOnServerSide} from '@/utils/extend/library/fetch';
import type {CheckableHabit, Habit, SubHabit} from '@/types/habit';


export async function getHabitListApi() {
  return customFetchOnServerSide('/api/habit/today', {
    method: 'GET',
    authorize: 'private',
  });
}

export interface PostHabitRequest extends Omit<Habit, 'pk' | 'has_unachieved' | 'children'> {
  children: SubHabit[];
}

export async function postHabitApi(habit: PostHabitRequest) {
  const {title, frequency_list, memo, children} = habit;

  return customFetchOnClientSide('/api/habit/original', {
    method: 'POST',
    authorize: 'private',
    body: {
      title,
      memo: memo,
      frequency_list,
      children,
    }
  });
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
