import {useMutation, useQueryClient} from '@tanstack/react-query';
import {type BaseSyntheticEvent, useState} from 'react';
import {useForm, type UseFormReturn, useWatch} from 'react-hook-form';
import {isMutationSettling} from '../query/mutation';
import type {StudyRecordApi} from './api';
import {isEmptyStudyRecord} from './empty';
import {STUDY_RECORD_FIELD_MESSAGES} from './limits';
import {studyRecordQueryKeys} from './query-keys';
import {
  addPendingFailTag,
  getRecordFormDefaultValues,
  parseRecordRejection,
  type RecordFormValues,
  toStudyRecordFields,
  UNEXPECTED_DELETE_FAILURE_MESSAGE,
  UNEXPECTED_FAILURE_MESSAGE,
} from './record-form';
import type {StudyRecord} from './type';

interface UseRecordFormParams {
  target: {
    date: string;
    month: string;
    /* 그날 기록이 없으면 undefined */
    record?: StudyRecord;
  };
  onClose: () => void;
  dependencies: {
    api: Pick<StudyRecordApi, 'postStudyRecordApi' | 'patchStudyRecordApi' | 'deleteStudyRecordApi'>;
    reportUnexpectedError: (error: unknown) => void;
  };
}

interface UseRecordFormResult {
  methods: UseFormReturn<RecordFormValues>;
  form: {
    /* 거절되지 않았거나, 다시 저장·삭제를 시작해 비웠으면 undefined */
    rejectionMessage: string | undefined;
    saving: boolean;
    deleting: boolean;
    handlers: {
      onSubmit: (event?: BaseSyntheticEvent) => Promise<void>;
      /* 그날 기록이 없어 지울 것이 없으면 undefined */
      onDelete: (() => Promise<void>) | undefined;
    };
  };
}

export default function useRecordForm({
  target: {date, month, record},
  onClose,
  dependencies: {api, reportUnexpectedError},
}: UseRecordFormParams): UseRecordFormResult {
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
        queryClient.invalidateQueries({queryKey: studyRecordQueryKeys.list(month)}),
        queryClient.invalidateQueries({queryKey: studyRecordQueryKeys.stats()}),
      ]),
    onError: (error: Error) => {
      if (parseRecordRejection(error)?.isStale) {
        void queryClient.invalidateQueries({queryKey: studyRecordQueryKeys.list(month)});
        void queryClient.invalidateQueries({queryKey: studyRecordQueryKeys.stats()});
      }
    },
  };
  const postMutation = useMutation({mutationFn: api.postStudyRecordApi, ...cacheHandlers});
  const patchMutation = useMutation({mutationFn: api.patchStudyRecordApi, ...cacheHandlers});
  const deleteMutation = useMutation({mutationFn: api.deleteStudyRecordApi, ...cacheHandlers});
  const saving = isMutationSettling(postMutation, patchMutation);
  const deleting = isMutationSettling(deleteMutation);

  const showRejection = (error: unknown, unexpectedFailureMessage: string) => {
    const rejection = parseRecordRejection(error);
    if (!rejection) {
      reportUnexpectedError(error);
    }
    setRejectionMessage(rejection?.message ?? unexpectedFailureMessage);
  };

  const onSubmit = methods.handleSubmit(
    async (values) => {
      // 웹은 버튼의 로딩 표시가 Enter 제출을 막지 않으므로, 저장·삭제 중에 다시 들어온 제출을 이 가드로 막는다
      if (saving || deleting) {
        return;
      }

      setRejectionMessage(undefined);

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
      setRejectionMessage(undefined);

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
      rejectionMessage,
      saving,
      deleting,
      handlers: {
        onSubmit,
        onDelete: remove,
      },
    },
  };
}
