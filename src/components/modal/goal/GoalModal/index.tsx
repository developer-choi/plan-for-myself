'use client';

import Modal from '@/components/modal';
import type {EssentialModalProp} from '@/store/reducers/modal';
import React from 'react';
import type {Goal} from '@/types/goal';
import {useGoalForm} from '@/utils/service/goal/goal-form';
import modalStyles from '@/styles/modal.module.scss';
import styles from './index.module.scss';
import commonStyles from '@/styles/common.module.scss';
import Button from '@/components/design-system/element/Button';
import Input from '@/components/design-system/form/Input';
import TextArea from '@/components/design-system/form/TextArea';

export interface GoalModalProp extends EssentialModalProp {
  data: Goal | undefined
}

// 반드시 Client Component에서만 사용할것
export default function GoalModal(props: GoalModalProp) {
  const {inputProps, formSubmit, isEdit} = useGoalForm(props)

  return (
    <Modal className={styles.styledModal} closeModal={props.closeModal} disableEasilyClose>
      <h1 className={modalStyles.modalHeading}>목표 {isEdit ? '수정' : '등록'}</h1>
      <form className={styles.styledForm} onSubmit={formSubmit}>
        <Input placeholder="제목 *" {...inputProps.title}/>
        <TextArea placeholder="내용" {...inputProps.content}/>
        <Input type="number" placeholder="달성 시 금액 *" {...inputProps.achievePrice}/>
        <Input type="number" placeholder="실패 시 금액" {...inputProps.notAchievePrice}/>
        <fieldset className={commonStyles.horizontalFieldset}>
          {inputProps.radioList.map(props => (
            <label key={props.value}>
              <input type="radio" {...props}/>
              {props.value}
            </label>
          ))}
        </fieldset>
        <div className={modalStyles.modalButtonWrap}>
          <Button variant="outlined" onClick={props.closeModal}>취소</Button>
          <Button onClick={formSubmit}>제출</Button>
        </div>
      </form>
    </Modal>
  )
}
