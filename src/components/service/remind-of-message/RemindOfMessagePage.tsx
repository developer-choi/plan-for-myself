'use client';

import habitStyles from '@/components/service/habit/TotalHabitList/index.module.scss';
import Button from '@/components/element/Button';
import React, {useCallback} from 'react';
import {
  deleteRemindOfMessageApi,
  postRemindOfMessageApi,
  RemindOfMessageItem,
  updateRemindOfMessageApi
} from '@/utils/service/api/remind-of-message';
import {useRouter} from 'next/navigation';
import layoutStyles from '@/styles/layout.module.scss';

export interface RemindOfMessagePageProps {
  list: RemindOfMessageItem[];
}

export default function RemindOfMessagePage({list}: RemindOfMessagePageProps) {
  const {refresh} = useRouter();

  const postMessage = useCallback(async () => {
    const message = window.prompt('Input your message');

    if (message) {
      await postRemindOfMessageApi(message);
      refresh();
    }
  }, [refresh]);

  const updateMessage = useCallback(async (id: RemindOfMessageItem['id']) => {
    const message = window.prompt('Edit your message');

    if (message) {
      await updateRemindOfMessageApi({id, message});
      refresh();
    }
  }, [refresh]);

  const deleteMessage = useCallback(async ({id, message}: RemindOfMessageItem) => {
    if (confirm(`${message.slice(0, 10)}...을 삭제하시겠습니까?`)) {
      try {
        await deleteRemindOfMessageApi(id);
        refresh();
      } catch (error) {
        alert('삭제 실패!' + JSON.stringify(error));
        console.error(error);
      }
    }
  }, [refresh]);

  return (
    <div className={layoutStyles.pageContentMedium}>
      <ul>
        {list.map((item) => (
          <ol key={item.id} className={habitStyles.habitOl}>
            <span className={habitStyles.title}>{item.message}</span>
            <Button size="small" color="edit" className={habitStyles.smallButton} style={{width: 'auto'}}
                    onClick={() => updateMessage(item.id)}>수정</Button>
            <Button size="small" color="delete" className={habitStyles.smallButton} style={{width: 'auto'}}
                    onClick={() => deleteMessage(item)}>삭제</Button>
          </ol>
        ))}
      </ul>
      <Button onClick={postMessage}>메시지 추가하기</Button>
    </div>
  )
}