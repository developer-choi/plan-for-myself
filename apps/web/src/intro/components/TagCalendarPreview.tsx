import typography from '@developer-choi/design-system/styles/typography';
import classNames from 'classnames';
import Card from '@/shared/components/Card';
import TagCalendar from '@/study-record-stats/components/TagCalendar';
import {getTagCalendar} from '@/study-record-stats/tag-detail';
import {INTRO_MONTH, INTRO_RECORDS, INTRO_TAG} from '@/intro/intro-examples';
import styles from './PreviewCard.module.scss';

export default function TagCalendarPreview() {
  return (
    <Card title={INTRO_TAG}>
      <h3 className={classNames(typography.body3, styles.subTitle)}>&apos;{INTRO_TAG}&apos;을 적은 날</h3>
      <TagCalendar calendar={getTagCalendar({month: INTRO_MONTH, records: INTRO_RECORDS, tag: INTRO_TAG})} />
    </Card>
  );
}
