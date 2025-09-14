import {RoutineProcessingErrorState} from '@/types/routine';
import {customFetchOnClientSide} from '@/utils/extend/library/fetch';

/**
 * @return 루틴이 진행중인지 여부를 반환
 */
export async function getIsRoutineProcessing(): Promise<boolean> {
  try {
    await customFetchOnClientSide('/api/routine', {
      method: 'GET',
      authorize: 'private',
    });

    return true;
  } catch (error: any) {
    if (error?.status === 404 && error.json.state) {
      const state = error.json.state as RoutineProcessingErrorState;
      return state === 'all_done';
    }

    throw error;
  }
}
