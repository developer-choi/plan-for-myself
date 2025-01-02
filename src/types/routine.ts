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
