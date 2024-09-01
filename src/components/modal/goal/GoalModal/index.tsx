'use client';

import React from 'react';
import type {Goal} from '@/types/goal';
import {useGoalForm} from '@/utils/service/goal/goal-form';
import styles from './index.module.scss';
import designSystemStyles from '@/styles/design-system.module.scss';
import Input from '@/components/form/Input';
import TextArea from '@/components/form/TextArea';
import {ComposedModalProps, ModalContainer} from '@/components/modal/container';
import {DefaultModalHeader} from '@/components/modal/header';
import DefaultModalBody from '@/components/modal/body';
import {TwoButtonsModalFooter} from '@/components/modal/footer';

export interface GoalModalProp extends ComposedModalProps {
  data: Goal | undefined
}

// 반드시 Client Component에서만 사용할것
export default function GoalModal(props: GoalModalProp) {
  const {inputProps, form, isEdit} = useGoalForm(props)

  return (
    <ModalContainer onClose={props.onClose}>
      <DefaultModalHeader>목표 {isEdit ? '수정' : '등록'}</DefaultModalHeader>
      <DefaultModalBody>
        <form className={styles.styledForm} onSubmit={form.onSubmit}>
          <Input placeholder="제목 *" {...inputProps.title}/>
          <TextArea placeholder="내용" {...inputProps.content}/>
          <Input type="number" placeholder="달성 시 금액 *" {...inputProps.achievePrice}/>
          <Input type="number" placeholder="실패 시 금액" {...inputProps.notAchievePrice}/>
          <fieldset className={designSystemStyles.horizontalFieldset}>
            {inputProps.radioList.map(props => (
              <label key={props.value}>
                <input type="radio" {...props}/>
                {props.value}
              </label>
            ))}
          </fieldset>
        </form>
      </DefaultModalBody>
      <TwoButtonsModalFooter
        left={{
          onClick: props.onClose,
        }}
        right={{
          onClick: form.onSubmit,
          buttonText: '제출',
          loading: form.loading,
        }}
      />
    </ModalContainer>
  )
}
