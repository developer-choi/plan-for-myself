import typography from '@developer-choi/design-system/styles/typography';
import classNames from 'classnames';
import Card from '@/shared/components/Card';
import TagCalendar from '@/study-record-stats/components/TagCalendar';
import {getTagCalendar} from '@plan-for-myself/shared/study-record-stats';
import {INTRO_MONTH, INTRO_RECORDS, INTRO_TAG, INTRO_TEXT} from '@plan-for-myself/shared/intro';
import styles from './PreviewCard.module.scss';

export default function TagCalendarPreview() {
  return (
    <Card title={INTRO_TAG}>
      <h3 className={classNames(typography.body3, styles.subTitle)}>{INTRO_TEXT.tagCalendarSubTitle}</h3>
      <TagCalendar calendar={getTagCalendar({month: INTRO_MONTH, records: INTRO_RECORDS, tag: INTRO_TAG})} />
    </Card>
  );
}
