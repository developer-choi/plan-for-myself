'use client';

import type {EssentialModalProp} from '@/store/reducers/modal';
import React from 'react';
import {useCheckGoalListForm} from '@/util/sevices/goal/check-goal';
import {numberWithComma} from '@/util/extend/number';
import styles from './index.module.scss';
import modalStyles from '@/util/style/modal.module.scss';
import Modal from '@/component/modal';
import classNames from 'classnames';
import Button from '@/component/design-system/element/Button';
import {GoalFullResponse} from '@/type/goal';

export interface CheckTodayModalProp extends EssentialModalProp {
  goalFullResponse: GoalFullResponse;
}

// 반드시 Client Component에서만 사용할것
export default function CheckTodayModal({closeModal, goalFullResponse}: CheckTodayModalProp) {
  const formResult = useCheckGoalListForm({closeModal, response: goalFullResponse});

  if (!formResult) {
    return null;
  }

  const {formSubmit, submitDisabled, radioList, submittedDate} = formResult;

  return (
    <Modal className={styles.styledModal} closeModal={closeModal} disableEasilyClose>
      <h1 className={modalStyles.modalHeading}>목표 체크리스트</h1>
      <form className={styles.styledForm} onSubmit={formSubmit}>
        {radioList.map(({props, title, price, checked, content}) => (
          <div key={props.value} className={styles.goalItem}>
            <label className={styles.customCheckbox}>
              <input type="checkbox" {...props}/>
              {title}
              <span className={classNames(styles.price, checked ? styles.positive : styles.negative)}>{`${checked ? '+' : '-'}${numberWithComma(price)}`}원</span>
            </label>
            {!content ? null : <div className={styles.content}>{content}</div>}
          </div>
        ))}
        {!submitDisabled ? null : (
          <div>
            제출시각 : {submittedDate}
          </div>
        )}
        <div className={modalStyles.modalButtonWrap}>
          <Button variant="outlined" onClick={closeModal}>취소</Button>
          <Button disabled={submitDisabled} type="submit">제출</Button>
        </div>
      </form>
    </Modal>
  );
}
