'use client';

import React, {useCallback, useMemo, useState} from 'react';
import styles from './index.module.scss';
import {Topic, TopicCategory} from '@/types/topic';
import {Button} from '@forworkchoe/core/components';
import TopicModal from './TopicModal';
import {itemListToDataOfType, randomInArray} from '@forworkchoe/core/utils';
import {useMutation} from '@tanstack/react-query';
import {deleteTopicApi} from '@/utils/service/api/topic-client';
import {revalidateTagOnServerAction} from '@/utils/extend/library/revalidate-tag';

interface TopicClientPageProps {
  topics: Topic[];
}

export default function TopicClientPage({topics}: TopicClientPageProps) {
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

  const getRandomTopic = useCallback((category: TopicCategory) => {
    const filteredTopics = topics.filter(topic => topic.category === category && topic.id !== displayTopic?.id);
    if (filteredTopics.length === 0) {
      alert(`${category} 카테고리에 해당하는 고민이 없습니다.`);
      return;
    }
    const randomTopic = randomInArray(filteredTopics)[0];
    setDisplayTopic(randomTopic);
  }, [displayTopic?.id, topics]);

  const countRecord = useMemo(() => {
    return topics.reduce((a, b) => {
      a[b.category]++;
      return a;
    }, {
      CONSTANT: 0,
      LONG_TERM: 0,
      SHORT_TERM: 0
    } as Record<TopicCategory, number>)
  }, [topics]);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.categoryButtons}>
          {itemList.map(item => (
            countRecord[item.value] === 0 ? null : <Button key={item.value} onClick={() => getRandomTopic(item.value)}>{item.name} 고민 꺼내기</Button>
          ))}
        </div>
        <div>
          <Button style={{width: '100%'}} color="success" onClick={() => setIsModalOpen(true)}>고민 관리하기</Button>
        </div>
        <div className={styles.worryDisplayArea}>
          <p>{displayTopic ? displayTopic.content : '버튼을 눌러 고민을 꺼내보세요!'}</p>
          {displayTopic && (
            <Button color="delete" size="small" onClick={onDelete} loading={isPending || isSuccess}>
              삭제
            </Button>
          )}
        </div>
        <div className={styles.tip}>
          <p>Tip: 시험에 안나오는 고민은 1분만 해보고 AI에게 물어보세요!</p>
        </div>
      </div>

      {isModalOpen && (
        <TopicModal
          topics={topics}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}

const {itemList} = itemListToDataOfType<TopicCategory>([
  {
    name: '단기',
    value: 'SHORT_TERM'
  },
  {
    name: '장기',
    value: 'LONG_TERM'
  },
  {
    name: '상시',
    value: 'CONSTANT'
  },
])