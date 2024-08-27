'use client';

import useStudiedTimeForm, {StudiedTimeFormData} from '@/utils/service/studied-time/useStudiedTimeForm';
import styles from './index.module.scss';
import Input from '@/components/design-system/form/Input';
import Radio, {RadioGroup} from '@/components/design-system/form/Radio';
import React from 'react';
import {StudiedTimeHistory} from '@/utils/service/api/studied-time';
import {ComposedModalProps, ModalContainer} from '@/components/modal/container';
import {DefaultModalHeader} from '@/components/modal/header';
import DefaultModalBody from '@/components/modal/body';
import {OneButtonModalFooter, TwoButtonsModalFooter} from '@/components/modal/footer';

export interface StudiedTimeFormModalProps extends ComposedModalProps {
  history: StudiedTimeHistory;
  initialFormData?: StudiedTimeFormData;
}

export default function StudiedTimeFormModal({initialFormData, history, onClose, ...rest}: StudiedTimeFormModalProps) {
  const {form, props} = useStudiedTimeForm(history, initialFormData);

  return (
    <ModalContainer type="centerAlign" onClose={onClose} {...rest}>
      <DefaultModalHeader onClose={onClose}></DefaultModalHeader>
      <DefaultModalBody>
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
        </form>
      </DefaultModalBody>
      {!history.data ? (
        <OneButtonModalFooter
          buttonText="추가"
          onClick={form.onSubmit}
          loading={form.loading}
          buttonType="submit"
        />
      ) : (
        <TwoButtonsModalFooter
          left={{
            buttonText: '삭제',
            onClick: form.deleteHistory
          }}
          right={{
            buttonText: '수정',
            onClick: form.onSubmit,
            loading: form.loading,
            buttonType: 'submit'
          }}
        />
      )}
    </ModalContainer>
  );
}
