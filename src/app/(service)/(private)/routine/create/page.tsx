import React from 'react';
import {ButtonLink} from '@forworkchoe/core/components';
import RoutineForm from '@/components/service/routine/RoutineForm';
import {getRoutineListApi} from '@/utils/service/api/routine-server';

export default async function Page() {
  const record = await getRoutineListApi();

  return (
    <>
      <ButtonLink href="/routine/list" size="large" className="full">루틴 관리</ButtonLink>
      <RoutineForm record={record}/>
    </>
  );
}
