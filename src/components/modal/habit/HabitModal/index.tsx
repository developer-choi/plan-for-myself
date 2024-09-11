'use client';

import React from 'react';
import type {Habit} from '@/types/habit';
import {useHabitForm} from '@/utils/service/habit/form';
import styles from './index.module.scss';
import designSystemStyles from '@/styles/design-system.module.scss';
import Input from '@/components/form/Input';
import TextArea from '@/components/form/TextArea';
import {ComposedModalProps, ModalContainer} from '@/components/modal/container';
import {DefaultModalHeader} from '@/components/modal/header';
import DefaultModalBody from '@/components/modal/body';
import {TwoButtonsModalFooter} from '@/components/modal/footer';
import Button from '@/components/element/Button';
import {Label} from '@/components/form/form-elements';
import classNames from 'classnames';

export interface HabitModalProp extends ComposedModalProps {
  data: Habit | undefined
}

// 반드시 Client Component에서만 사용할것
export default function HabitModal(props: HabitModalProp) {
  const {inputProps, form, isEdit} = useHabitForm(props)

  return (
    <ModalContainer onClose={props.onClose}>
      <DefaultModalHeader>습관 {isEdit ? '수정' : '등록'}</DefaultModalHeader>
      <DefaultModalBody>
        <form className={styles.habitForm} onSubmit={form.onSubmit}>
          <Input placeholder="제목 *" {...inputProps.title}/>
          <div>
            <Label>하위 습관</Label>
            <div className={designSystemStyles.commonSubForm}>
              {...inputProps.childrenList.map(({props, is_important}, index) => (
                <Input key={props.name} className={classNames({is_important})} rightRender={<button onClick={() => form.removeChildren(index)}>삭제</button>} {...props}/>
              ))}
              <Button onClick={form.appendChildren} color="secondary">Append</Button>
            </div>
          </div>
          <TextArea placeholder="메모" {...inputProps.memo}/>
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
  );
}
