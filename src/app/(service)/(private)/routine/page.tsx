import {getProcessingRoutine} from '@/utils/service/api/routine-server';
import React from 'react';
import {ProcessableRoutine, RoutineProcessingErrorState} from '@/types/routine';
import {redirect} from 'next/navigation';
import ChooseRoutineDateType from '@/components/service/routine/ChooseRoutineDateType';
import {ButtonLink} from '@/components/element/Button';
import ProcessableRoutinePage from '@/components/service/routine/ProcessableRoutineStepList';
import EmptyList from '@/components/element/EmptyList';
import {DateType} from '@/utils/service/constant/date-type';
import {Metadata} from 'next';
import {ApiResponseError} from '@forworkchoe/core/utils';

export const metadata: Metadata = {
  title: 'Routine'
}

export default async function Page() {
  try {
    const routine = await getProcessingRoutine();

    return (
      <ProcessableRoutinePage routine={routine}/>
    );
  } catch (error: any) {
    // TODO 미래에 이 API 에러응답좀 바꾸기. 이게 에런가 싶기도 하고...
    if (error instanceof ApiResponseError && error.response.data.state) {
      switch (error.response.data.state as RoutineProcessingErrorState) {
        case 'all_done':
          return (
            <>
              <ButtonLink style={{marginBottom: 16}} href="/routine/list" size="large" className="full">루틴 관리</ButtonLink>
              <EmptyList>오늘 루틴을 모두 완료했어요</EmptyList>
            </>
          );

        case 'select_date_type':
          return (
            <ChooseRoutineDateType record={error.response.data.record as Record<DateType, ProcessableRoutine[]>}/>
          );

        case 'routine_is_empty': {
          redirect('/routine/create');
        }
      }
    }

    throw error;
  }
}
