'use client';

import React from 'react';
import {useCheckHabitListForm} from '@/utils/service/habit/check';
import styles from './index.module.scss';
import {HabitFullResponse} from '@/types/habit';
import {ComposedModalProps, ModalContainer} from '@/components/modal/container';
import {DefaultModalHeader} from '@/components/modal/header';
import DefaultModalBody from '@/components/modal/body';
import {TwoButtonsModalFooter} from '@/components/modal/footer';
import Checkbox from '@/components/form/Checkbox';

export interface CheckTodayModalProp extends ComposedModalProps {
  habitFullResponse: HabitFullResponse;
}

// 반드시 Client Component에서만 사용할것
export default function CheckTodayModal({onClose, habitFullResponse}: CheckTodayModalProp) {
  const formResult = useCheckHabitListForm({onClose, response: habitFullResponse});

  if (!formResult) {
    return null;
  }

  const {form, radioList, submittedDate} = formResult;

  return (
    <ModalContainer onClose={onClose}>
      <DefaultModalHeader>습관 체크리스트</DefaultModalHeader>
      <DefaultModalBody>
        <form className={styles.styledForm} onSubmit={form.onSubmit}>
          {radioList.map(({propsList, pk, title, memo}) => (
            <div key={pk} >
              <div>{title}</div>
              {propsList.map(props => (
                <Checkbox key={props.value as string} {...props}/>
              ))}
              {!memo ? null : <div className={styles.memo}>{memo}</div>}
            </div>
          ))}
          {!form.disabled ? null : (
            <div>
              제출시각 : {submittedDate}
            </div>
          )}
        </form>
      </DefaultModalBody>
      <TwoButtonsModalFooter
        left={{
          onClick: onClose,
        }}
        right={{
          onClick: form.onSubmit,
          buttonText: '제출',
          loading: form.loading,
          disabled: form.disabled
        }}
      />
    </ModalContainer>
  );
}
