'use client';

import React, {useCallback, useState} from 'react';
import styles from './index.module.scss';
import {Topic, TopicCategory} from '@/types/topic';
import {Button} from '@forworkchoe/core/components';
import TopicModal from './TopicModal';
import {randomInArray} from '@forworkchoe/core/utils';
import {useMutation} from '@tanstack/react-query';
import {deleteTopicApi} from '@/utils/service/api/topic-client';
import {revalidateTagOnServerAction} from '@/utils/extend/library/revalidate-tag';

interface TopicClientPageProps {
  initialTopics: Topic[];
}

export default function TopicClientPage({initialTopics}: TopicClientPageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [displayTopic, setDisplayTopic] = useState<Topic | null>(null);

  const {mutateAsync: deleteMutate, isPending, isSuccess, reset} = useMutation({
    mutationFn: deleteTopicApi,
  });

  const onDelete = useCallback(async () => {
    if (!displayTopic) {
      return;
    }
    if (window.confirm('정말로 삭제하시겠습니까?')) {
      try {
        await deleteMutate(displayTopic.id);
        await revalidateTagOnServerAction('TOPIC_LIST');
        setDisplayTopic(null);
        reset();
      } catch (error: any) {
        alert(error.message);
      }
    }
  }, [deleteMutate, displayTopic, reset]);

  const getRandomTopic = (category: TopicCategory) => {
    const filteredTopics = initialTopics.filter(topic => topic.category === category && topic.id !== displayTopic?.id);
    if (filteredTopics.length === 0) {
      alert(`${category} 카테고리에 해당하는 고민이 없습니다.`);
      return;
    }
    const randomTopic = randomInArray(filteredTopics)[0];
    setDisplayTopic(randomTopic);
  };

  return (
    <>
      <div className={styles.container}>
        <h1 className={styles.title}>오늘의 고민</h1>
        <div className={styles.categoryButtons}>
          <Button onClick={() => getRandomTopic('LONG_TERM')}>장기 고민 꺼내기</Button>
          <Button onClick={() => getRandomTopic('SHORT_TERM')}>단기 고민 꺼내기</Button>
          <Button onClick={() => getRandomTopic('CONSTANT')}>상시 고민 꺼내기</Button>
        </div>
        <div>
          <Button color="success" onClick={() => setIsModalOpen(true)}>고민 관리하기</Button>
        </div>
        <div className={styles.worryDisplayArea}>
          <p>{displayTopic ? displayTopic.content : '버튼을 눌러 고민을 꺼내보세요!'}</p>
          {displayTopic && (
            <Button color="delete" size="small" onClick={onDelete} loading={isPending || isSuccess}>
              삭제
            </Button>
          )}
        </div>
      </div>

      {isModalOpen && (
        <TopicModal
          topics={initialTopics}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}