'use client';

import {Caption, Chip, Radio, RadioGroup, TextField} from '@developer-choi/design-system';
import typography from '@developer-choi/design-system/styles/typography';
import {STUDY_RECORD_FIELD_LIMITS} from '@plan-for-myself/shared';
import classNames from 'classnames';
import {type KeyboardEvent, useId} from 'react';
import {Controller, useController, useFormContext} from 'react-hook-form';
import {
  addFailTag,
  MINUTE_SLOTS,
  type MinuteSlot,
  type RecordFormValues,
  validateMinuteInput,
} from '@/study-record/record-form';
import calendarStyles from './CalendarGrid.module.scss';
import styles from './RecordForm.module.scss';

interface MinuteFieldProps {
  slot: MinuteSlot;
  label: string;
}

export default function RecordFormFields() {
  const {
    control,
    formState: {errors},
  } = useFormContext<RecordFormValues>();
  const minutesError = MINUTE_SLOTS.map(({slot}) => errors.minutes?.[slot]?.message).find(Boolean);

  return (
    <div className={styles.fields}>
      <fieldset>
        <legend className={classNames(typography.body2, styles.sectionLabel)}>평일 / 휴일</legend>
        <Controller
          control={control}
          name="holiday"
          render={({field}) => (
            <RadioGroup
              direction="row"
              name={field.name}
              value={field.value ? 'holiday' : 'weekday'}
              onChange={(event) => field.onChange(event.target.value === 'holiday')}
            >
              <Radio value="weekday">평일</Radio>
              <Radio value="holiday">휴일</Radio>
            </RadioGroup>
          )}
        />
      </fieldset>

      <FailTagInput />

      <fieldset>
        <legend className={classNames(typography.body2, styles.sectionLabel)}>공부시간</legend>
        <div className={styles.minutes}>
          {MINUTE_SLOTS.map(({slot, label}) => (
            <MinuteField key={slot} label={label} slot={slot} />
          ))}
        </div>
        {minutesError && (
          <Caption isInvalid className={styles.minutesError}>
            {minutesError}
          </Caption>
        )}
      </fieldset>
    </div>
  );
}

const FULL_FAIL_TAGS_PLACEHOLDER = `최대 ${STUDY_RECORD_FIELD_LIMITS.failTags.maxCount}개까지`;

function FailTagInput() {
  const id = useId();
  const {
    control,
    register,
    getValues,
    setValue,
    setError,
    clearErrors,
    formState: {errors},
  } = useFormContext<RecordFormValues>();
  const {field: failTagsField} = useController({control, name: 'failTags'});
  const failTags = failTagsField.value;
  const isFull = failTags.length >= STUDY_RECORD_FIELD_LIMITS.failTags.maxCount;

  const removeFailTag = (tag: string) => {
    clearErrors('failTagInput');
    failTagsField.onChange(failTags.filter((failTag) => failTag !== tag));
  };

  const addTagOnEnter = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') {
      return;
    }

    /* 이 칸의 Enter는 폼 제출이 아니라 태그 추가다 */
    event.preventDefault();
    const result = addFailTag(failTags, getValues('failTagInput'));
    if (!result.ok) {
      setError('failTagInput', {message: result.message});
      return;
    }

    clearErrors('failTagInput');
    setValue('failTagInput', '');
    failTagsField.onChange(result.failTags);
  };

  return (
    <div>
      <label className={classNames(typography.body2, styles.sectionLabel)} htmlFor={id}>
        실패 태그
      </label>
      <TextField
        {...register('failTagInput', {onChange: () => clearErrors('failTagInput')})}
        autoComplete="off"
        disabled={isFull}
        error={errors.failTagInput?.message}
        id={id}
        placeholder={isFull ? FULL_FAIL_TAGS_PLACEHOLDER : '단어 하나 입력 후 Enter'}
        onKeyDown={addTagOnEnter}
      />
      {failTags.length > 0 && (
        <div className={styles.chips}>
          {failTags.map((tag) => (
            <Chip
              key={tag}
              className={styles.chip}
              color="danger"
              removeLabel={`${tag} 지우기`}
              size="small"
              variant="soft"
              onRemove={() => removeFailTag(tag)}
            >
              <span className={calendarStyles.chipText}>{tag}</span>
            </Chip>
          ))}
        </div>
      )}
    </div>
  );
}

function MinuteField({slot, label}: MinuteFieldProps) {
  const id = useId();
  const {register} = useFormContext<RecordFormValues>();

  return (
    <div>
      <label className={classNames(typography.body3, styles.fieldLabel)} htmlFor={id}>
        {label}
      </label>
      <TextField
        {...register(`minutes.${slot}`, {validate: validateMinuteInput})}
        id={id}
        inputMode="numeric"
        placeholder="0"
        suffix="분"
      />
    </div>
  );
}
