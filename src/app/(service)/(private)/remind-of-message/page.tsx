import React from 'react';
import RemindOfMessagePage from '@/component/remind-of-message/RemindOfMessagePage';
import {getRemindOfMessageListApiOnServer} from '@/util/sevices/api/goal-server';

export default async function Page() {
  const list = await getRemindOfMessageListApiOnServer();

  return (
    <RemindOfMessagePage list={list}/>
  );
}
