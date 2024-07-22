'use client';

import Modal from '@component/modal';
import type {EssentialModalProp} from '@store/reducers/modal';
import React from 'react';
import Button from '@component/common/button';
import {Input, TextArea} from '@component/common/Input';
import type {Goal} from '@type/goal';
import {useGoalForm} from '@util/sevices/goal-form';
import modalStyles from '@/util/style/modal.module.scss';
import styles from './index.module.scss';
import commonStyles from '@/util/style/common.module.scss';

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
          <Button className="gray" onClick={props.closeModal}>취소</Button>
          <Button onClick={formSubmit}>제출</Button>
        </div>
      </form>
    </Modal>
  )
}
