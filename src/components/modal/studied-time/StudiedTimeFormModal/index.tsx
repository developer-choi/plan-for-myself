'use client';

import useStudiedTimeForm, {StudiedTimeFormData} from '@/utils/service/studied-time/useStudiedTimeForm';
import styles from './index.module.scss';
import Input from '@/components/form/Input';
import Radio, {RadioGroup} from '@/components/form/Radio';
import React from 'react';
import {StudiedTimeCalendarWeek} from '@/utils/service/api/studied-time';
import {ComposedModalProps, ModalContainer} from '@/components/modal/container';
import {DefaultModalHeader} from '@/components/modal/header';
import DefaultModalBody from '@/components/modal/body';
import {OneButtonModalFooter, TwoButtonsModalFooter} from '@/components/modal/footer';
import dayjs from 'dayjs';

export interface StudiedTimeFormModalProps extends ComposedModalProps {
  history: StudiedTimeCalendarWeek;
  initialFormData?: StudiedTimeFormData;
}

export default function StudiedTimeFormModal({initialFormData, history, onClose, ...rest}: StudiedTimeFormModalProps) {
  const {form, props} = useStudiedTimeForm(history, onClose, initialFormData);

  return (
    <ModalContainer onClose={onClose} {...rest} disableOpenFocus={false}>
      <DefaultModalHeader onClose={onClose}>{dayjs(history.calendarDate.original).format('MM-DD')} 공부기록 {history.data ? '수정' : '작성'}</DefaultModalHeader>
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

          <Input {...props.wakeupTimeInputProps}/>
          <Input {...props.bedTimeInputProps}/>
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
