'use client';

import {Button, Dialog, IconButton} from '@developer-choi/design-system';
import typography from '@developer-choi/design-system/styles/typography';
import {Cross2Icon} from '@radix-ui/react-icons';
import classNames from 'classnames';
import Link from 'next/link';
import {focusOnMount} from '@/demo/focus-on-mount';
import type {DemoChoiceReason} from '@/demo/demo-choice-reason';
import {START_RECORDING_LABEL} from '@/shared/labels';
import styles from './DemoChoiceDialog.module.scss';

interface LoggedOutDemoChoiceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  reason: DemoChoiceReason;
}

export default function LoggedOutDemoChoiceDialog({isOpen, onClose, reason}: LoggedOutDemoChoiceDialogProps) {
  const {title, description} = MESSAGES[reason];

  return (
    <Dialog.Root open={isOpen} onClose={onClose}>
      <Dialog.Close asChild>
        <IconButton className={styles.close} icon={<Cross2Icon />} />
      </Dialog.Close>
      <Dialog.Title
        ref={focusOnMount}
        className={classNames(typography.body1, typography.bold, styles.title)}
        tabIndex={-1}
      >
        {title}
      </Dialog.Title>
      <div className={classNames(typography.body2, styles.description)}>
        {description.map((sentence) => (
          <p key={sentence}>{sentence}</p>
        ))}
      </div>
      <div className={styles.options}>
        <Button asChild size="large">
          <Link href="/login" onClick={onClose}>
            {START_RECORDING_LABEL}
          </Link>
        </Button>
        <button className={classNames(typography.body2, styles.textLink)} type="button" onClick={onClose}>
          계속 둘러보기
        </button>
      </div>
    </Dialog.Root>
  );
}

/* 설명은 문장마다 한 줄로 그린다 — 한 단락으로 흘리면 고정 폭 창에서 「내 / 기록」처럼 낱말 묶음이 갈라진다 */
const MESSAGES: Record<DemoChoiceReason, {title: string; description: string[]}> = {
  'tour-end': {
    title: '이제 내 달력에 적어 볼까요?',
    description: ['지금까지 본 건 예시예요.', '실패를 적으면 내 기록으로 채워져요.'],
  },
  'date-click': {
    title: '예시 화면에서는 기록할 수 없어요',
    description: ['내 달력을 만들면 바로 적을 수 있어요.'],
  },
};
