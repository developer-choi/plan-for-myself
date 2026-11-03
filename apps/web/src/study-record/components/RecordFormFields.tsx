'use client';

import {Caption, Chip, Radio, RadioGroup, TextField} from '@developer-choi/design-system';
import typography from '@developer-choi/design-system/styles/typography';
import {
  getMinutesError,
  MINUTE_SLOTS,
  type MinuteSlot,
  RECORD_FORM_LABELS,
  type RecordFormValues,
  validateMinuteInput,
} from '@plan-for-myself/shared';
import {useFailTagInput} from '@plan-for-myself/shared/react';
import classNames from 'classnames';
import {type KeyboardEvent, useId} from 'react';
import {Controller, useFormContext} from 'react-hook-form';
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
  const minutesError = getMinutesError(errors);

  return (
    <div className={styles.fields}>
      <fieldset>
        <legend className={classNames(typography.body2, styles.sectionLabel)}>{RECORD_FORM_LABELS.dateType}</legend>
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
              <Radio value="weekday">{RECORD_FORM_LABELS.weekday}</Radio>
              <Radio value="holiday">{RECORD_FORM_LABELS.holiday}</Radio>
            </RadioGroup>
          )}
        />
      </fieldset>

      <FailTagInput />

      <fieldset>
        <legend className={classNames(typography.body2, styles.sectionLabel)}>{RECORD_FORM_LABELS.minutes}</legend>
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

function FailTagInput() {
  const id = useId();
  const {register} = useFormContext<RecordFormValues>();
  const {
    failTags,
    isFull,
    placeholder,
    errorMessage,
    handlers: {clearError, addFailTagInput, removeFailTag},
  } = useFailTagInput();

  const addTagOnEnter = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') {
      return;
    }

    /* 이 칸의 Enter는 폼 제출이 아니라 태그 추가다 */
    event.preventDefault();
    addFailTagInput();
  };

  return (
    <div>
      <label className={classNames(typography.body2, styles.sectionLabel)} htmlFor={id}>
        {RECORD_FORM_LABELS.failTags}
      </label>
      <TextField
        {...register('failTagInput', {onChange: clearError})}
        autoComplete="off"
        disabled={isFull}
        error={errorMessage}
        id={id}
        placeholder={placeholder}
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
        placeholder={RECORD_FORM_LABELS.minutePlaceholder}
        suffix={RECORD_FORM_LABELS.minuteSuffix}
      />
    </div>
  );
}
