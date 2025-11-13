'use client';

import {SubmitHandler, useForm, useWatch} from 'react-hook-form';
import {postTopicApi} from '@/utils/service/api/topic-client';
import {Topic, TopicCategory} from '@/types/topic';
import {useMutation} from '@tanstack/react-query';
import {ComponentProps, useMemo} from 'react';
import {InputProps} from '@/components/form/Input';
import {revalidateTagOnServerAction} from '@/utils/extend/library/revalidate-tag';

export interface TopicFormData {
  content: string;
  category: TopicCategory;
}

export default function useTopicForm(topics: Topic[]) {
  const {register, handleSubmit, control, setValue} = useForm<TopicFormData>({
    defaultValues: {
      content: '',
      category: 'SHORT_TERM',
    },
  });
  const category = useWatch({
    name: 'category',
    control,
  });

  const {mutateAsync: createMutate, ...createMutation} = useMutation({
    mutationFn: postTopicApi,
  });

  const onSubmit: SubmitHandler<TopicFormData> = async (data) => {
    if (!data.content.trim()) {
      alert('고민 내용을 입력해주세요.');
      return;
    }
    try {
      await createMutate(data);
      await revalidateTagOnServerAction('TOPIC_LIST');
      setValue('content', '');
    } catch (error: any) {
      alert(error.message);
    }
  };
  
  const isLoading = createMutation.isPending;

  const filteredTopics = useMemo(() => {
    return topics.filter(topic => topic.category === category);
  }, [topics, category]);

  const contentProps: InputProps = {
    ...register('content', {
      required: '고민 내용은 필수입니다.'
    }),
    placeholder: '고민 내용',
    disabled: isLoading
  };

  const categoryProps: ComponentProps<'select'> = {
    ...register('category', {required: '카테고리는 필수입니다.'}),
    disabled: isLoading
  };

  return {
    form: {
      onSubmit: handleSubmit(onSubmit),
      isLoading,
    },
    props: {
      category: categoryProps,
      content: contentProps
    },
    state: {
      filteredTopics,
    }
  };
}
