import {DateType} from '@/utils/service/constant/date-type';

// 루틴 생성, 읽기, 수정하는데 공통적으로 쓰는 타입
export interface PureRoutine {
  title: string; // ex: 평일 직후 퇴근시간 루틴
  date_type: DateType;
  routine_type: 'custom' | FixedRoutineType;
  steps: PureRoutineStep[];
}

export type PureRoutineStep = LinkRoutineStep | HabitRoutineStep | StudiedMinutesRoutineStep | SleepTimeRoutineStep;

// 루틴을 가져오는데 추가로 필요한 데이터 타입
export interface ReadableRoutine extends Omit<PureRoutine, 'steps'> {
  id: number;
  steps: ReadableRoutineStep[];
}

export type ReadableRoutineStep = PureRoutineStep & {
  id: number;
};

// 루틴을 체크하는데 추가로 필요한 데이터 타입
export interface ProcessableRoutine extends Omit<ReadableRoutine, 'steps'> {
  steps: ProcessableRoutineStep[];
}

export type ProcessableRoutineStep = Pick<ReadableRoutineStep, 'id'> & {
  is_processed: boolean; // 과거에 진행 완료한 루틴 아이템
  is_processing: boolean; // 현재 진행중인 루틴 아이템 여부 (= 과거 제외하고 제일 먼저 있는 루틴 아이템)
} & (LinkRoutineStep | HabitRoutineStep | ProcessableStudiedMinutesRoutineStep | ProcessableSleepTimeRoutineStep);

export type ProcessableStudiedMinutesRoutineStep = StudiedMinutesRoutineStep & {
  studied_minutes?: number; // DB에 required가 안걸려있어서 없을 수 있음.
};

export type ProcessableSleepTimeRoutineStep = SleepTimeRoutineStep & {
  sleep_time?: string; // DB에 required가 안걸려있어서 없을 수 있음.
};

/*************************************************************************************************************
 * Pure Routine Steps
 *************************************************************************************************************/
export type LinkRoutineStep = {
  type: 'link';
  url: string;
  text: string;
};

export type HabitRoutineStep = {
  type: 'habit';
  text: string;
  keyword: string;
};

export type StudiedMinutesRoutineStep = {
  type: 'studied_minutes';
};

export type SleepTimeRoutineStep = {
  type: 'sleep_time'; // 수면 or 취침시각
};

/*************************************************************************************************************
 * Etc
 *************************************************************************************************************/
export type FixedRoutineType = 'morning' | 'lunch' | 'night';
export type RoutineProcessingErrorState = 'all_done' | 'routine_is_empty' | 'select_date_type'
