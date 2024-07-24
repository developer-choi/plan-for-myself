'use client';

import React, {useCallback, useEffect, useState} from 'react';
import {
  deleteRemindOfMessageApi,
  getRemindOfMessageListApi,
  postRemindOfMessageApi,
  RemindOfMessageItem, updateRemindOfMessageApi
} from '@/util/sevices/api/remind-of-message';
import Button, {BaseButton} from '@/component/common/button';
import styles from '../page.module.scss';
import goalStyles from '@/component/TotalGoalList/index.module.scss';
import classNames from 'classnames';

export default function Page() {
  const [list, setList] = useState<RemindOfMessageItem[]>([]);

  const refresh = useCallback(() => {
    getRemindOfMessageListApi().then(list => {
      setList(list);
    });
  }, []);

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    <div className={styles.wrap}>
      <Button onClick={postMessage}>메시지 추가하기</Button>
      <ul>
        {list.map((item) => (
          <ol key={item.id} className={goalStyles.goalOl}>
            <span className={goalStyles.title}>{item.message}</span>
            <BaseButton className={classNames(goalStyles.smallButton, goalStyles.edit)} onClick={() => updateMessage(item.id)}>수정</BaseButton>
            <BaseButton className={classNames(goalStyles.smallButton, goalStyles.delete)} onClick={() => deleteMessage(item)}>삭제</BaseButton>
          </ol>
        ))}
      </ul>
    </div>
  );
}
