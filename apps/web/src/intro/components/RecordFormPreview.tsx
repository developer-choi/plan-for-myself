'use client';

import typography from '@developer-choi/design-system/styles/typography';
import classNames from 'classnames';
import {FormProvider, useForm} from 'react-hook-form';
import {formatDateTitle} from '@/study-record/calendar-date';
import RecordFormFields from '@/study-record/components/RecordFormFields';
import {getRecordFormDefaultValues, type RecordFormValues} from '@/study-record/record-form';
import {INTRO_FORM_RECORD} from '@/intro/intro-examples';
import styles from './RecordFormPreview.module.scss';

export default function RecordFormPreview() {
  const methods = useForm<RecordFormValues>({
    defaultValues: getRecordFormDefaultValues(INTRO_FORM_RECORD.date, INTRO_FORM_RECORD),
  });

  return (
    <div className={styles.sheet}>
      <p className={classNames(typography.h4, typography.bold)}>{formatDateTitle(INTRO_FORM_RECORD.date)}</p>
      <FormProvider {...methods}>
        <RecordFormFields />
      </FormProvider>
    </div>
  );
}
