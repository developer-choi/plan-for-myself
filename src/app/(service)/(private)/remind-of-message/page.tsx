import React from 'react';
import RemindOfMessagePage from '@/components/service/remind-of-message/RemindOfMessagePage';
import {getRemindOfMessageListApiOnServer} from '@/utils/service/api/remind-of-message';

export default async function Page() {
  const list = await getRemindOfMessageListApiOnServer();

  return (
    <RemindOfMessagePage list={list}/>
  );
}
