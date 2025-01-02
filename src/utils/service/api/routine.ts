import {PureRoutine, PureRoutineStep, ReadableRoutine} from '@/types/routine';
import {DateType} from '@/utils/service/constant/date-type';
import {customFetchOnClientSide, customFetchOnServerSide} from '@/utils/extend/library/fetch';

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

export async function getRoutineDetailApi(id: number) {
  const {json} = await customFetchOnServerSide(`/api/routine/${id}`, {
    method: 'GET',
    authorize: 'private',
  });

  return json as ReadableRoutine;
}
