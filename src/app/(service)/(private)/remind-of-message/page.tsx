import React from 'react';
import RemindOfMessagePage from '@/components/remind-of-message/RemindOfMessagePage';
import {getRemindOfMessageListApiOnServer} from '@/utils/service/api/goal';

export default async function Page() {
  const list = await getRemindOfMessageListApiOnServer();

  return (
    <RemindOfMessagePage list={list}/>
  );
}
