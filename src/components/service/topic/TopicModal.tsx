import React from 'react';
import styles from './index.module.scss';
import {Topic} from '@/types/topic';
import {
  Button,
  ComposedModalProps,
  DefaultModalBody,
  DefaultModalHeader,
  ModalContainer
} from '@forworkchoe/core/components';
import TopicListItem from '@/components/service/topic/TopicListItem';
import Input from '@/components/form/Input';
import EmptyList from '@/components/element/EmptyList';
import useTopicForm from '@/utils/service/topic/useTopicForm';

interface TopicModalProps extends ComposedModalProps {
  topics: Topic[];
}

export default function TopicModal({topics, onClose, ...rest}: TopicModalProps) {
  const {form, state, props} = useTopicForm(topics);

  return (
    <ModalContainer type="centerAlign" onClose={onClose} {...rest}>
      <DefaultModalHeader onClose={onClose}>고민 관리</DefaultModalHeader>
      <DefaultModalBody>
        <form onSubmit={form.onSubmit}>
          <div className={styles.worryControls}>
            <select {...props.category}>
              <option value="SHORT_TERM">단기</option>
              <option value="LONG_TERM">장기</option>
              <option value="CONSTANT">상시</option>
            </select>
            <Input {...props.content} />
            <Button type="submit" loading={form.isLoading}>추가</Button>
          </div>
        </form>

        {state.filteredTopics.length === 0 ? (
          <EmptyList>고민이 없습니다. 추가해주세요.</EmptyList>
        ) : (
          <ul className={styles.worryManagementList}>
            {state.filteredTopics.map(topic => (
              <TopicListItem topic={topic} key={topic.id} />
            ))}
          </ul>
        )}
      </DefaultModalBody>
    </ModalContainer>
  );
}