import React from 'react';
import RemindOfMessagePage from '@/components/remind-of-message/RemindOfMessagePage';
import {getRemindOfMessageListApiOnServer} from '@/util/sevices/api/goal';

export default async function Page() {
  const list = await getRemindOfMessageListApiOnServer();

  return (
    <RemindOfMessagePage list={list}/>
  );
}
