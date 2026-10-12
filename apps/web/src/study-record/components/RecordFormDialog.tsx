'use client';

import {Button, Callout, Dialog, IconButton} from '@developer-choi/design-system';
import typography from '@developer-choi/design-system/styles/typography';
import {isEmptyStudyRecord, STUDY_RECORD_FIELD_MESSAGES, type StudyRecord} from '@plan-for-myself/shared';
import {Cross2Icon} from '@radix-ui/react-icons';
import {captureException} from '@sentry/nextjs';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import classNames from 'classnames';
import {type BaseSyntheticEvent, useState} from 'react';
import {FormProvider, useForm, type UseFormReturn, useWatch} from 'react-hook-form';
import {isMutationSettling} from '@/shared/query/mutation';
import {deleteStudyRecordApi, patchStudyRecordApi, postStudyRecordApi} from '@/study-record/api';
import {formatDateTitle} from '@/study-record/calendar-date';
import RecordFormFields from '@/study-record/components/RecordFormFields';
import {studyRecordQueries, studyRecordStatsQueries} from '@/study-record/queries';
import {
  type AddFailTagResult,
  addFailTag,
  getRecordFormDefaultValues,
  type RecordFormValues,
  parseRecordRejection,
  toStudyRecordFields,
  UNEXPECTED_DELETE_FAILURE_MESSAGE,
  UNEXPECTED_FAILURE_MESSAGE,
} from '@/study-record/record-form';
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
  const {methods, form} = useRecordForm({date, month, record, onClose});

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
              <Button
                color="destructive"
                disabled={form.saving}
                loading={form.deleting}
                size="large"
                onClick={form.onDelete}
              >
                삭제
              </Button>
            )}
            <Button disabled={form.deleting} loading={form.saving} size="large" type="submit">
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
  month: string;
  /* 그날 기록이 없으면 undefined */
  record?: StudyRecord;
  onClose: () => void;
}

interface UseRecordFormResult {
  methods: UseFormReturn<RecordFormValues>;
  form: {
    onSubmit: (event?: BaseSyntheticEvent) => Promise<void>;
    /* 그날 기록이 없어 지울 것이 없으면 undefined */
    onDelete: (() => Promise<void>) | undefined;
    /* 거절되지 않았거나, 다시 저장·삭제를 시작해 비웠으면 undefined */
    rejectionMessage: string | undefined;
    /* 추가·수정 요청이 진행 중이거나 성공해 모달이 닫히기 전이면 true */
    saving: boolean;
    /* 삭제 요청이 진행 중이거나 성공해 모달이 닫히기 전이면 true */
    deleting: boolean;
  };
}

function useRecordForm({date, month, record, onClose}: UseRecordFormParams): UseRecordFormResult {
  const methods = useForm<RecordFormValues>({
    defaultValues: getRecordFormDefaultValues(date, record),
  });
  const [rejectionMessage, setRejectionMessage] = useState<string>();

  const [holiday, failTags, minutes, failTagInput] = useWatch({
    control: methods.control,
    name: ['holiday', 'failTags', 'minutes', 'failTagInput'],
  });
  const filled =
    !isEmptyStudyRecord(toStudyRecordFields({holiday, failTags, minutes, failTagInput})) || failTagInput.trim() !== '';
  if (filled && rejectionMessage === STUDY_RECORD_FIELD_MESSAGES.emptyRecord) {
    setRejectionMessage(undefined);
  }

  const queryClient = useQueryClient();
  const cacheHandlers = {
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({queryKey: studyRecordQueries.list.key(month)}),
        queryClient.invalidateQueries({queryKey: studyRecordStatsQueries.all.key()}),
      ]),
    onError: (error: Error) => {
      if (parseRecordRejection(error)?.isStale) {
        queryClient.invalidateQueries({queryKey: studyRecordQueries.list.key(month)});
        queryClient.invalidateQueries({queryKey: studyRecordStatsQueries.all.key()});
      }
    },
  };
  const postMutation = useMutation({mutationFn: postStudyRecordApi, ...cacheHandlers});
  const patchMutation = useMutation({mutationFn: patchStudyRecordApi, ...cacheHandlers});
  const deleteMutation = useMutation({mutationFn: deleteStudyRecordApi, ...cacheHandlers});
  const saving = isMutationSettling(postMutation, patchMutation);
  const deleting = isMutationSettling(deleteMutation);

  const showRejection = (error: unknown, unexpectedFailureMessage: string) => {
    const rejection = parseRecordRejection(error);
    if (!rejection) {
      console.error(error);
      captureException(error);
    }
    setRejectionMessage(rejection?.message ?? unexpectedFailureMessage);
  };

  /* handleSubmit의 검증이 규칙 없는 칸의 오류를 지우므로, 태그 칸은 검증이 끝난 뒤의 두 콜백에서 판정한다 */
  const onSubmit = methods.handleSubmit(
    async (values) => {
      // Button loading은 submit을 막지 못하므로, 저장·삭제 중 [저장] 클릭·Enter 제출을 이 가드로 막는다
      if (saving || deleting) {
        return;
      }

      const failTagResult = addPendingFailTag(values.failTags, values.failTagInput);
      if (!failTagResult.ok) {
        methods.setError('failTagInput', {message: failTagResult.message}, {shouldFocus: true});
        return;
      }

      const fields = toStudyRecordFields({...values, failTags: failTagResult.failTags});
      if (isEmptyStudyRecord(fields)) {
        setRejectionMessage(STUDY_RECORD_FIELD_MESSAGES.emptyRecord);
        return;
      }

      setRejectionMessage(undefined);
      try {
        await (record
          ? patchMutation.mutateAsync({pk: record.pk, ...fields})
          : postMutation.mutateAsync({date, ...fields}));
        onClose();
      } catch (error) {
        showRejection(error, UNEXPECTED_FAILURE_MESSAGE);
      }
    },
    () => {
      const failTagResult = addPendingFailTag(methods.getValues('failTags'), methods.getValues('failTagInput'));
      if (!failTagResult.ok) {
        methods.setError('failTagInput', {message: failTagResult.message});
      }
    },
  );

  const remove =
    record &&
    (async () => {
      setRejectionMessage(undefined);
      try {
        await deleteMutation.mutateAsync({pk: record.pk});
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
      saving,
      deleting,
    },
  };
}

function addPendingFailTag(failTags: string[], input: string): AddFailTagResult {
  if (failTags.includes(input.trim())) {
    return {ok: true, failTags};
  }

  return addFailTag(failTags, input);
}
