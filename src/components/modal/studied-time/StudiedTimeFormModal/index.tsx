'use client';

import useStudiedTimeForm, {StudiedTimeFormData} from '@/utils/service/studied-time/useStudiedTimeForm';
import styles from './index.module.scss';
import Input from '@/components/design-system/form/Input';
import Radio, {RadioGroup} from '@/components/design-system/form/Radio';
import Button from '@/components/design-system/element/Button';
import type {EssentialModalProp} from '@/store/reducers/modal';
import React from 'react';
import Modal from '@/components/modal';
import {StudiedTimeHistory} from '@/utils/service/api/studied-time';

export interface StudiedTimeFormModalProps extends EssentialModalProp {
  history: StudiedTimeHistory;
  initialFormData?: StudiedTimeFormData;
}

export default function StudiedTimeFormModal({initialFormData, history, ...rest}: StudiedTimeFormModalProps) {
  const {form, props} = useStudiedTimeForm(history, initialFormData);

  return (
    <Modal {...rest}>
      <form className={styles.formWrap} onSubmit={form.onSubmit}>
        <RadioGroup label={props.dateType.groupLabel}>
          {props.dateType.list.map((props, index) => (
            <Radio key={index} {...props} />
          ))}
        </RadioGroup>

        {props.studiedMinutesInputList.map((props, index) => (
          <Input key={index} {...props}/>
        ))}

        <Input {...props.fail.keywords}/>
        <Input {...props.fail.reason}/>
        <div className={styles.buttonWrap}>
          {!history.data ? null : <Button size="large" variant="outlined" color="delete" onClick={form.deleteHistory}>삭제</Button>}
          <Button size="large" type="submit" loading={form.loading}>{history.data ? '수정' : '추가'}</Button>
        </div>
      </form>
    </Modal>
  );
}
