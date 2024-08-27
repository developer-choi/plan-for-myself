'use client';

import React from 'react';
import {useCheckGoalListForm} from '@/utils/service/goal/check-goal';
import {numberWithComma} from '@/utils/extend/data-type/number';
import styles from './index.module.scss';
import classNames from 'classnames';
import {GoalFullResponse} from '@/types/goal';
import {ComposedModalProps, ModalContainer} from '@/components/modal/container';
import {DefaultModalHeader} from '@/components/modal/header';
import DefaultModalBody from '@/components/modal/body';
import {TwoButtonsModalFooter} from '@/components/modal/footer';

export interface CheckTodayModalProp extends ComposedModalProps {
  goalFullResponse: GoalFullResponse;
}

// 반드시 Client Component에서만 사용할것
export default function CheckTodayModal({onClose, goalFullResponse}: CheckTodayModalProp) {
  const formResult = useCheckGoalListForm({onClose, response: goalFullResponse});

  if (!formResult) {
    return null;
  }

  const {form, radioList, submittedDate} = formResult;

  return (
    <ModalContainer onClose={onClose} type="centerAlign">
      <DefaultModalHeader>목표 체크리스트</DefaultModalHeader>
      <DefaultModalBody>
        <form className={styles.styledForm} onSubmit={form.onSubmit}>
          {radioList.map(({props, title, price, checked, content}) => (
            <div key={props.value} className={styles.goalItem}>
              <label className={styles.customCheckbox}>
                <input type="checkbox" {...props}/>
                {title}
                <span
                  className={classNames(styles.price, checked ? styles.positive : styles.negative)}>{`${checked ? '+' : '-'}${numberWithComma(price)}`}원</span>
              </label>
              {!content ? null : <div className={styles.content}>{content}</div>}
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
