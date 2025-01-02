import {ProcessableRoutineStep, PureRoutineStep, RoutineProcessingErrorState} from '@/types/routine';

export const ROUTINE_STEP_TYPE: PureRoutineStep['type'][] = ['studied_minutes', 'link', 'habit', 'sleep_time'];

export const ROUTINE_PROCESSING_ERROR: Record<RoutineProcessingErrorState, RoutineProcessingErrorState> = {
  all_done: 'all_done',
  routine_is_empty: 'routine_is_empty',
  select_date_type: 'select_date_type'
};

export function getProcessingRoutineStepId(step: ProcessableRoutineStep) {
  if (!step.is_processing) {
    return undefined;
  }

  return `processing-routine-step-${step.id}`;
}
