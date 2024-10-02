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
import {RadioGroup} from '@/components/form/Radio';
import Checkbox from '@/components/form/Checkbox';

export interface HabitModalProp extends ComposedModalProps {
  data: Habit | undefined
}

// 반드시 Client Component에서만 사용할것
export default function HabitModal(props: HabitModalProp) {
  const {inputProps, form, isEdit} = useHabitForm(props)

  return (
    <ModalContainer onClose={props.onClose} disableOpenFocus={isEdit}>
      <DefaultModalHeader>습관 {isEdit ? '수정' : '등록'}</DefaultModalHeader>
      <DefaultModalBody>
        <form className={styles.habitForm} onSubmit={form.onSubmit}>
          <Input placeholder="제목 *" {...inputProps.title}/>
          <div>
            <Label>하위 습관</Label>
            <div className={designSystemStyles.commonSubForm}>
              {...inputProps.childrenList.map(({props, is_achieved, id}, index) => (
                <Input key={id} className={classNames({is_important: !is_achieved})} rightRender={<button type="button" onClick={() => form.removeChildren(index)}>삭제</button>} {...props}/>
              ))}
              <Button onClick={form.appendChildren} color="secondary">Append</Button>
            </div>
          </div>
          <TextArea placeholder="메모" {...inputProps.memo}/>
          <RadioGroup label="습관주기">
            {inputProps.checkboxList.map(props => (
              <Checkbox key={props.value} {...props}/>
            ))}
          </RadioGroup>
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
