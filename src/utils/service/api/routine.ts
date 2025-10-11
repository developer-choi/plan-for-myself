import {PureRoutine, PureRoutineStep, ReadableRoutine} from '@/types/routine';
import {fetchFromClient} from '@/utils/extend/library/fetch/fromClient';

export async function resetRoutineLogsApi() {
  return fetchFromClient('/api/routine', {
    method: 'DELETE',
    authPolicy: 'private',
    next: {
      tags: ['PROCESSABLE_ROUTINE_LIST']
    }
  });
}

export type PostRoutineApiRequest = PureRoutine;
export async function postRoutineApi(data: PostRoutineApiRequest) {
  return fetchFromClient('/api/routine', {
    method: 'POST',
    authPolicy: 'private',
    body: data
  });
}

export interface UpdateRoutineApiRequest extends Omit<ReadableRoutine, 'steps'> {
  steps: (PureRoutineStep & {
    id?: number; // 수정폼이면 있을 수도 있음.
  })[];
}

export async function updateRoutineApi(data: UpdateRoutineApiRequest) {
  return fetchFromClient(`/api/routine/${data.id}`, {
    method: 'PATCH',
    authPolicy: 'private',
    body: data
  });
}

export async function deleteRoutineApi(id: number) {
  return fetchFromClient(`/api/routine/${id}`, {
    method: 'DELETE',
    authPolicy: 'private',
  });
}

export type UpdateRoutineListOrderApiRequest = number[];

export function updateRoutineListOrderApi(list: ReadableRoutine[]) {
  const request: UpdateRoutineListOrderApiRequest = list.map(({id}) => id);

  return fetchFromClient('/api/routine/list', {
    method: 'PATCH',
    authPolicy: 'private',
    body: request
  });
}

/**
 * @exception 404 다른 사람 루틴인 경우 or 아예 없는 루틴인 경우
 * @exception 401 로그인 안한 경우
 * @exception 400 다른 루틴 타입을 지정한 경우 (링크형인데 습관처럼 데이터를 제출했거나)
 */
export interface PostRoutineStepApiRequest {
  stepId: number;
}

export async function postLinkRoutineStepApi({stepId}: PostRoutineStepApiRequest) {
  return fetchFromClient(`/api/routine/${stepId}/link`, {
    method: 'POST',
    authPolicy: 'private',
  });
}

export interface PostHabitRoutineApiRequest extends PostRoutineStepApiRequest {
  isAchieved: boolean;
}

export async function postHabitRoutineStepApi({stepId, isAchieved}: PostHabitRoutineApiRequest) {
  return fetchFromClient(`/api/routine/${stepId}/habit`, {
    method: 'POST',
    authPolicy: 'private',
    body: {
      isAchieved
    }
  });
}

export interface PostStudiedMinutesRoutineApiRequest extends PostRoutineStepApiRequest {
  studied_minutes: number;
}

export async function postStudiedMinutesRoutineStepApi({stepId, studied_minutes}: PostStudiedMinutesRoutineApiRequest) {
  return fetchFromClient(`/api/routine/${stepId}/studied_minutes`, {
    method: 'POST',
    authPolicy: 'private',
    body: {
      studied_minutes
    }
  });
}

export interface PostSleepTimeRoutineApiRequest extends PostRoutineStepApiRequest {
  sleep_time: string;
}

export async function postSleepTimeRoutineStepApi({stepId, sleep_time}: PostSleepTimeRoutineApiRequest) {
  return fetchFromClient(`/api/routine/${stepId}/sleep_time`, {
    method: 'POST',
    authPolicy: 'private',
    body: {
      sleep_time
    }
  });
}
