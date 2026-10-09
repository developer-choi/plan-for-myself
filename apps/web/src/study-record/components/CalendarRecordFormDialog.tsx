'use client';

import type {StudyRecord} from '@plan-for-myself/shared';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {isMutationSettling} from '@/shared/query/mutation';
import {
  deleteStudyRecordApi,
  patchStudyRecordApi,
  postStudyRecordApi,
  type StudyRecordFieldsRequest,
} from '@/study-record/api';
import RecordFormDialog from '@/study-record/components/RecordFormDialog';
import {studyRecordQueries, studyRecordStatsQueries} from '@/study-record/queries';
import {parseRecordRejection} from '@/study-record/record-form';

interface CalendarRecordFormDialogProps {
  isOpen: boolean;
  date: string;
  month: string;
  /* 그날 기록이 없으면 undefined */
  record?: StudyRecord;
  onClose: () => void;
}

export default function CalendarRecordFormDialog({
  isOpen,
  date,
  month,
  record,
  onClose,
}: CalendarRecordFormDialogProps) {
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

  const save = (fields: StudyRecordFieldsRequest): Promise<unknown> =>
    record ? patchMutation.mutateAsync({pk: record.pk, ...fields}) : postMutation.mutateAsync({date, ...fields});

  return (
    <RecordFormDialog
      date={date}
      isOpen={isOpen}
      loading={isMutationSettling(postMutation, patchMutation, deleteMutation)}
      record={record}
      onClose={onClose}
      onDelete={record && (() => deleteMutation.mutateAsync({pk: record.pk}))}
      onSave={save}
    />
  );
}
