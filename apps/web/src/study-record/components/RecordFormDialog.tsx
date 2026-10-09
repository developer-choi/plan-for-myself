'use client';

import {Button, Callout, Dialog, IconButton} from '@developer-choi/design-system';
import typography from '@developer-choi/design-system/styles/typography';
import type {StudyRecord} from '@plan-for-myself/shared';
import {Cross2Icon} from '@radix-ui/react-icons';
import classNames from 'classnames';
import {type BaseSyntheticEvent, useState} from 'react';
import {FormProvider, useForm, type UseFormReturn} from 'react-hook-form';
import type {StudyRecordFieldsRequest} from '@/study-record/api';
import {formatDateTitle} from '@/study-record/calendar-date';
import RecordFormFields from '@/study-record/components/RecordFormFields';
import {
  getRecordFormDefaultValues,
  type RecordFormValues,
  parseRecordRejection,
  toStudyRecordFields,
  UNEXPECTED_DELETE_FAILURE_MESSAGE,
  UNEXPECTED_FAILURE_MESSAGE,
  validateFailTagInput,
} from '@/study-record/record-form';
import styles from './RecordForm.module.scss';

interface RecordFormDialogProps {
  isOpen: boolean;
  date: string;
  /* 그날 기록이 없으면 undefined */
  record?: StudyRecord;
  onSave: (fields: StudyRecordFieldsRequest) => Promise<unknown>;
  /* 그날 기록이 없으면 undefined */
  onDelete?: () => Promise<unknown>;
  onClose: () => void;
  loading: boolean;
}

export default function RecordFormDialog({
  isOpen,
  date,
  record,
  onSave,
  onDelete,
  onClose,
  loading,
}: RecordFormDialogProps) {
  const {methods, form} = useRecordForm({date, record, onSave, onDelete, onClose, loading});

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
        <form className={styles.form} onSubmit={form.onSubmit}>
          <Dialog.Content>
            <RecordFormFields />
            {form.rejectionMessage && (
              <Callout className={styles.rejection} color="danger">
                {form.rejectionMessage}
              </Callout>
            )}
          </Dialog.Content>
          <Dialog.Footer>
            {form.onDelete && (
              <Button color="destructive" loading={loading} size="large" onClick={form.onDelete}>
                삭제
              </Button>
            )}
            <Button loading={loading} size="large" type="submit">
              저장
            </Button>
          </Dialog.Footer>
        </form>
      </FormProvider>
    </Dialog.Root>
  );
}

interface UseRecordFormParams {
  date: string;
  /* 그날 기록이 없으면 undefined */
  record?: StudyRecord;
  onSave: RecordFormDialogProps['onSave'];
  /* 그날 기록이 없으면 undefined */
  onDelete?: RecordFormDialogProps['onDelete'];
  onClose: () => void;
  loading: boolean;
}

interface UseRecordFormResult {
  methods: UseFormReturn<RecordFormValues>;
  form: {
    onSubmit: (event?: BaseSyntheticEvent) => Promise<void>;
    /* 그날 기록이 없어 지울 것이 없으면 undefined */
    onDelete: (() => Promise<void>) | undefined;
    /* 거절되지 않았거나, 다시 저장·삭제를 시작해 비웠으면 undefined */
    rejectionMessage: string | undefined;
  };
}

function useRecordForm({date, record, onSave, onDelete, onClose, loading}: UseRecordFormParams): UseRecordFormResult {
  const methods = useForm<RecordFormValues>({
    defaultValues: getRecordFormDefaultValues(date, record),
  });
  const [rejectionMessage, setRejectionMessage] = useState<string>();

  const showRejection = (error: unknown, unexpectedFailureMessage: string) => {
    const rejection = parseRecordRejection(error);
    if (!rejection) {
      console.error(error);
    }
    setRejectionMessage(rejection?.message ?? unexpectedFailureMessage);
  };

  /* handleSubmit의 검증이 규칙 없는 칸의 오류를 지우므로, 태그 칸은 검증이 끝난 뒤의 두 콜백에서 판정한다 */
  const onSubmit = methods.handleSubmit(
    async (values) => {
      // Button loading은 submit을 막지 못하므로, [저장] 클릭·Enter 중복 제출 모두 이 가드로 막는다
      if (loading) {
        return;
      }

      const failTagInputResult = validateFailTagInput(values.failTagInput);
      if (failTagInputResult !== true) {
        methods.setError('failTagInput', {message: failTagInputResult}, {shouldFocus: true});
        return;
      }

      setRejectionMessage(undefined);
      try {
        await onSave(toStudyRecordFields(values));
        onClose();
      } catch (error) {
        showRejection(error, UNEXPECTED_FAILURE_MESSAGE);
      }
    },
    () => {
      const failTagInputResult = validateFailTagInput(methods.getValues('failTagInput'));
      if (failTagInputResult !== true) {
        methods.setError('failTagInput', {message: failTagInputResult});
      }
    },
  );

  const remove =
    onDelete &&
    (async () => {
      setRejectionMessage(undefined);
      try {
        await onDelete();
        onClose();
      } catch (error) {
        showRejection(error, UNEXPECTED_DELETE_FAILURE_MESSAGE);
      }
    });

  return {
    methods,
    form: {
      onSubmit,
      onDelete: remove,
      rejectionMessage,
    },
  };
}
