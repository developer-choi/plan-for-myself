'use client';

import {Button} from '@developer-choi/design-system';
import typography from '@developer-choi/design-system/styles/typography';
import {FIRST_RECORD_TEXT} from '@plan-for-myself/shared/study-record';
import {toDateMonthParam} from '@plan-for-myself/shared/date';
import {openOnce} from '@plan-for-myself/shared/overlay';
import {PlusIcon} from '@radix-ui/react-icons';
import classNames from 'classnames';
import Logo from '@/shared/components/Logo';
import RecordFormDialog from '@/study-record/components/RecordFormDialog';
import styles from './FirstRecord.module.scss';

interface FirstRecordProps {
  today: string;
}

export default function FirstRecord({today}: FirstRecordProps) {
  const openTodayRecordForm = () => {
    openOnce('record-form', ({isOpen, unmount}) => (
      <RecordFormDialog date={today} isOpen={isOpen} month={toDateMonthParam(today)} onClose={unmount} />
    ));
  };

  return (
    <section className={styles.firstRecord}>
      <Logo size="large" />
      <header className={styles.text}>
        <h2 className={classNames(typography.h4, typography.bold)}>{FIRST_RECORD_TEXT.title}</h2>
        <p className={classNames(typography.body2, styles.description)}>{FIRST_RECORD_TEXT.description}</p>
      </header>
      <Button size="large" onClick={openTodayRecordForm}>
        <PlusIcon />
        {FIRST_RECORD_TEXT.action}
      </Button>
    </section>
  );
}
