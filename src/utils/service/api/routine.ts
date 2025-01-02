import {ProcessableRoutine, PureRoutine, PureRoutineStep, ReadableRoutine} from '@/types/routine';
import {DateType} from '@/utils/service/constant/date-type';
import {customFetchOnClientSide, customFetchOnServerSide} from '@/utils/extend/library/fetch';

export async function resetRoutineLogsApi() {
  return customFetchOnClientSide('/api/routine', {
    method: 'DELETE',
    authorize: 'private'
  });
}

export type PostRoutineApiRequest = PureRoutine;
export async function postRoutineApi(data: PostRoutineApiRequest) {
  return customFetchOnClientSide('/api/routine', {
    method: 'POST',
    authorize: 'private',
    body: data
  });
}

export interface UpdateRoutineApiRequest extends Omit<ReadableRoutine, 'steps'> {
  steps: (PureRoutineStep & {
    id?: number; // 수정폼이면 있을 수도 있음.
  })[];
}

export async function updateRoutineApi(data: UpdateRoutineApiRequest) {
  return customFetchOnClientSide(`/api/routine/${data.id}`, {
    method: 'PATCH',
    authorize: 'private',
    body: data
  });
}

export async function getRoutineListApi() {
  const {json} = await customFetchOnServerSide('/api/routine/list', {
    method: 'GET',
    authorize: 'private',
  });

  return json as Record<DateType, ReadableRoutine[]>;
}

export type UpdateRoutineListOrderApiRequest = number[];

export function updateRoutineListOrderApi(list: ReadableRoutine[]) {
  const request: UpdateRoutineListOrderApiRequest = list.map(({id}) => id);

  return customFetchOnClientSide('/api/routine/list', {
    method: 'PATCH',
    authorize: 'private',
    body: request
  });
}

export async function getRoutineDetailApi(id: number) {
  const {json} = await customFetchOnServerSide(`/api/routine/${id}`, {
    method: 'GET',
    authorize: 'private',
  });

  return json as ReadableRoutine;
}

/**
 * @exception 애초에 루틴이 없는 경우
 * @exception 오늘 할거 다 한 경우
 * @exception 주말이냐 평일이냐 조차 안고른 경우
 */
export async function getProcessingRoutine(): Promise<ProcessableRoutine> {
  const {json} = await customFetchOnServerSide('/api/routine', {
    method: 'GET',
    authorize: 'private',
  });

  return json;
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
  return customFetchOnClientSide(`/api/routine/${stepId}/link`, {
    method: 'POST',
    authorize: 'private',
  });
}

export interface PostHabitRoutineApiRequest extends PostRoutineStepApiRequest {
  isAchieved: boolean;
}

export async function postHabitRoutineStepApi({stepId, isAchieved}: PostHabitRoutineApiRequest) {
  return customFetchOnClientSide(`/api/routine/${stepId}/habit`, {
    method: 'POST',
    authorize: 'private',
    body: {
      isAchieved
    }
  });
}

export interface PostStudiedMinutesRoutineApiRequest extends PostRoutineStepApiRequest {
  studied_minutes: number;
}

export async function postStudiedMinutesRoutineStepApi({stepId, studied_minutes}: PostStudiedMinutesRoutineApiRequest) {
  return customFetchOnClientSide(`/api/routine/${stepId}/studied_minutes`, {
    method: 'POST',
    authorize: 'private',
    body: {
      studied_minutes
    }
  });
}

export interface PostSleepTimeRoutineApiRequest extends PostRoutineStepApiRequest {
  sleep_time: string;
}

export async function postSleepTimeRoutineStepApi({stepId, sleep_time}: PostSleepTimeRoutineApiRequest) {
  return customFetchOnClientSide(`/api/routine/${stepId}/sleep_time`, {
    method: 'POST',
    authorize: 'private',
    body: {
      sleep_time
    }
  });
}
