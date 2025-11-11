import {ProcessableRoutine, ReadableRoutine} from '@/types/routine';
import {DateType} from '@/utils/service/constant/date-type';
import {fetchFromServer} from '@/utils/extend/library/fetch/fromServer';

export async function getRoutineListApi() {
  const {data} = await fetchFromServer<Record<DateType, ReadableRoutine[]>>('/api/routine/list', {
    method: 'GET',
    authPolicy: 'private',
    next: {
      tags: ['READABLE_ROUTINE_LIST']
    }
  });

  return data;
}

export async function getRoutineDetailApi(id: number) {
  const {data} = await fetchFromServer<ReadableRoutine>(`/api/routine/${id}`, {
    method: 'GET',
    authPolicy: 'private',
  });

  return data;
}

/**
 * @exception 애초에 루틴이 없는 경우
 * @exception 오늘 할거 다 한 경우
 * @exception 주말이냐 평일이냐 조차 안고른 경우
 */
export async function getProcessingRoutineApi() {
  const {data} = await fetchFromServer<ProcessableRoutine>('/api/routine', {
    method: 'GET',
    authPolicy: 'private',
  });

  return data;
}
