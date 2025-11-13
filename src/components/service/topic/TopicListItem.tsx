'use client';

import React, {useCallback} from 'react';
import {Topic} from '@/types/topic';
import {useMutation} from '@tanstack/react-query';
import {deleteTopicApi} from '@/utils/service/api/topic-client';
import {revalidateTagOnServerAction} from '@/utils/extend/library/revalidate-tag';
import styles from './index.module.scss';
import {Button} from '@forworkchoe/core/components';

interface TopicListItemProps {
  topic: Topic;
}

export default function TopicListItem({topic}: TopicListItemProps) {
  const {mutateAsync, isPending, isSuccess} = useMutation({
    mutationFn: deleteTopicApi,
  });

  const onDelete = useCallback(async () => {
    if (window.confirm('정말로 삭제하시겠습니까?')) {
      try {
        await mutateAsync(topic.id);
        await revalidateTagOnServerAction('TOPIC_LIST');
      } catch (error: any) {
        alert(error.message);
      }
    }
  }, [mutateAsync, topic.id]);

  return (
    <li key={topic.id}>
      <div className={styles.worryItemContent}>
        <span>{topic.content}</span>
      </div>
      <div className={styles.worryItemButtons}>
        <Button size="small" color="delete" onClick={onDelete} loading={isPending || isSuccess}>삭제</Button>
      </div>
    </li>
  );
}
