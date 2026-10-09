'use client';

import {Button} from '@developer-choi/design-system';
import typography from '@developer-choi/design-system/styles/typography';
import {PlusIcon} from '@radix-ui/react-icons';
import classNames from 'classnames';
import {overlay} from 'overlay-kit';
import Logo from '@/shared/components/Logo';
import {toDateMonthParam} from '@/study-record/calendar-date';
import CalendarRecordFormDialog from '@/study-record/components/CalendarRecordFormDialog';
import styles from './FirstRecord.module.scss';

interface FirstRecordProps {
  today: string;
}

export default function FirstRecord({today}: FirstRecordProps) {
  const openTodayRecordForm = () => {
    overlay.open(({isOpen, unmount}) => (
      <CalendarRecordFormDialog date={today} isOpen={isOpen} month={toDateMonthParam(today)} onClose={unmount} />
    ));
  };

  return (
    <section className={styles.firstRecord}>
      <Logo size="large" />
      <header className={styles.text}>
        <h2 className={classNames(typography.h4, typography.bold)}>첫 기록을 남겨 보세요</h2>
        <p className={classNames(typography.body2, styles.description)}>하루 공부시간과 실패한 일을 적어요</p>
      </header>
      <Button size="large" onClick={openTodayRecordForm}>
        <PlusIcon />
        기록하기
      </Button>
    </section>
  );
}
