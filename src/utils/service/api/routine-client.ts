import {RoutineProcessingErrorState} from '@/types/routine';
import {fetchFromClient} from '@/utils/extend/library/fetch/fromClient';
import {ApiResponseError} from '@forworkchoe/core/utils';

/**
 * @return 루틴이 진행중인지 여부를 반환
 */
export async function getIsRoutineProcessing(): Promise<boolean> {
  try {
    await fetchFromClient('/api/routine', {
      method: 'GET',
      authPolicy: 'private',
    });

    return true;
  } catch (error: any) {
    // TODO 미래에 이 API 에러응답좀 바꾸기. 이게 에런가 싶기도 하고...
    if (error instanceof ApiResponseError && error.response.status === 404 && error.response.data.state) {
      const state = error.response.data.state as RoutineProcessingErrorState;
      return state === 'all_done';
    }

    throw error;
  }
}
