'use client';

import {Button, Dialog, IconButton} from '@developer-choi/design-system';
import typography from '@developer-choi/design-system/styles/typography';
import type {StudyRecord} from '@plan-for-myself/shared';
import {Cross2Icon} from '@radix-ui/react-icons';
import classNames from 'classnames';
import type {StudyRecordFieldsRequest} from '@/study-record/api';
import {formatDateTitle} from '@/study-record/calendar-date';
import RecordFormFields from '@/study-record/components/RecordFormFields';
import styles from './RecordForm.module.scss';

interface RecordFormDialogProps {
  isOpen: boolean;
  date: string;
  /* 그날 기록이 없으면 undefined */
  record?: StudyRecord;
  onSave: (fields: StudyRecordFieldsRequest) => Promise<unknown>;
  onDelete: () => Promise<unknown>;
  onClose: () => void;
}

export default function RecordFormDialog({isOpen, date, record, onClose}: RecordFormDialogProps) {
  const hasRecord = record !== undefined;

  return (
    <Dialog.Root open={isOpen} onClose={onClose}>
      <Dialog.Header>
        <Dialog.Title className={classNames(typography.h4, typography.bold)}>{formatDateTitle(date)}</Dialog.Title>
        <Dialog.Close asChild>
          <IconButton icon={<Cross2Icon />} />
        </Dialog.Close>
      </Dialog.Header>
      {/* [저장]이 이 폼의 submit 버튼이어야 공부시간 칸 Enter로도 저장된다. 상자는 없애 모달 배치는 그대로 둔다 */}
      <form className={styles.form}>
        <Dialog.Content>
          <RecordFormFields />
        </Dialog.Content>
        <Dialog.Footer>
          {hasRecord && (
            <Button color="destructive" size="large">
              삭제
            </Button>
          )}
          <Button size="large" type="submit">
            저장
          </Button>
        </Dialog.Footer>
      </form>
    </Dialog.Root>
  );
}
