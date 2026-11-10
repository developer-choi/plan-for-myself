'use client';

import typography from '@developer-choi/design-system/styles/typography';
import {
  formatDateTitle,
  getRecordFormDefaultValues,
  INTRO_FORM_RECORD,
  type RecordFormValues,
} from '@plan-for-myself/shared';
import classNames from 'classnames';
import {FormProvider, useForm} from 'react-hook-form';
import RecordFormFields from '@/study-record/components/RecordFormFields';
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
