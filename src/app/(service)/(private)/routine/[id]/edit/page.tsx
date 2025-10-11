import React from 'react';
import {ServerComponentProps} from 'next';
import {getRoutineDetailApi, getRoutineListApi} from '@/utils/service/api/routine-server';
import RoutineForm from '@/components/service/routine/RoutineForm';

export default async function Page({params}: ServerComponentProps) {
  const [record, data] = await Promise.all([getRoutineListApi(), getRoutineDetailApi(Number(params.id))])

  return (
    <RoutineForm record={record} detail={data}/>
  );
}
