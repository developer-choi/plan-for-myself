'use client';

import {Button, Callout, Dialog, IconButton} from '@developer-choi/design-system';
import typography from '@developer-choi/design-system/styles/typography';
import {formatDateTitle} from '@plan-for-myself/shared/date';
import {RECORD_FORM_LABELS, type StudyRecord, useRecordForm} from '@plan-for-myself/shared/study-record';
import {Cross2Icon} from '@radix-ui/react-icons';
import {captureException} from '@sentry/nextjs';
import classNames from 'classnames';
import {FormProvider} from 'react-hook-form';
import {studyRecordApi} from '@/study-record/api';
import RecordFormFields from '@/study-record/components/RecordFormFields';
import styles from './RecordForm.module.scss';

interface RecordFormDialogProps {
  isOpen: boolean;
  date: string;
  /* 저장·삭제 뒤 새로 받을 달력의 달 */
  month: string;
  /* 그날 기록이 없으면 undefined */
  record?: StudyRecord;
  onClose: () => void;
}

export default function RecordFormDialog({isOpen, date, month, record, onClose}: RecordFormDialogProps) {
  const {methods, form} = useRecordForm({
    target: {date, month, record},
    onClose,
    dependencies: {
      api: studyRecordApi,
      reportUnexpectedError: (error) => {
        console.error(error);
        captureException(error);
      },
    },
  });

  return (
    <Dialog.Root open={isOpen} onClose={onClose}>
      <Dialog.Header>
        <Dialog.Title className={classNames(typography.h4, typography.bold)}>{formatDateTitle(date)}</Dialog.Title>
        <Dialog.Close asChild>
          <IconButton icon={<Cross2Icon />} />
        </Dialog.Close>
      </Dialog.Header>
      <FormProvider {...methods}>
        {/* [저장]이 이 폼의 submit 버튼이어야 공부시간 칸 Enter로도 저장된다 */}
        <form className={styles.form} onSubmit={form.handlers.onSubmit}>
          <Dialog.Content>
            <RecordFormFields />
            {form.rejectionMessage && (
              <Callout className={styles.rejection} color="danger">
                {form.rejectionMessage}
              </Callout>
            )}
          </Dialog.Content>
          <Dialog.Footer>
            {form.handlers.onDelete && (
              <Button
                color="destructive"
                disabled={form.saving}
                loading={form.deleting}
                size="large"
                onClick={form.handlers.onDelete}
              >
                {RECORD_FORM_LABELS.delete}
              </Button>
            )}
            <Button disabled={form.deleting} loading={form.saving} size="large" type="submit">
              {RECORD_FORM_LABELS.save}
            </Button>
          </Dialog.Footer>
        </form>
      </FormProvider>
    </Dialog.Root>
  );
}
