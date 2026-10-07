'use client';

import {Radio, RadioGroup, TextField} from '@developer-choi/design-system';
import typography from '@developer-choi/design-system/styles/typography';
import classNames from 'classnames';
import {useId} from 'react';
import {MINUTE_SLOTS, type MinuteSlot} from '@/study-record/record-form';
import styles from './RecordForm.module.scss';

interface MinuteFieldProps {
  slot: MinuteSlot;
  label: string;
}

export default function RecordFormFields() {
  return (
    <div className={styles.fields}>
      <fieldset>
        <legend className={classNames(typography.body2, styles.sectionLabel)}>평일 / 휴일</legend>
        <RadioGroup direction="row" name="holiday">
          <Radio value="weekday">평일</Radio>
          <Radio value="holiday">휴일</Radio>
        </RadioGroup>
      </fieldset>

      <FailTagInput />

      <fieldset>
        <legend className={classNames(typography.body2, styles.sectionLabel)}>공부시간</legend>
        <div className={styles.minutes}>
          {MINUTE_SLOTS.map(({slot, label}) => (
            <MinuteField key={slot} label={label} slot={slot} />
          ))}
        </div>
      </fieldset>
    </div>
  );
}

function FailTagInput() {
  const id = useId();

  return (
    <div>
      <label className={classNames(typography.body2, styles.sectionLabel)} htmlFor={id}>
        실패 태그
      </label>
      <TextField autoComplete="off" id={id} placeholder="단어 하나 입력 후 Enter" />
    </div>
  );
}

function MinuteField({label}: MinuteFieldProps) {
  const id = useId();

  return (
    <div>
      <label className={classNames(typography.body3, styles.fieldLabel)} htmlFor={id}>
        {label}
      </label>
      <TextField id={id} inputMode="numeric" placeholder="0" suffix="분" />
    </div>
  );
}
