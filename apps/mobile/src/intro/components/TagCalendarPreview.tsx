import {getTagCalendar, INTRO_MONTH, INTRO_RECORDS, INTRO_TAG, INTRO_TEXT} from '@plan-for-myself/shared';
import PreviewSubTitle from '@/intro/components/PreviewSubTitle';
import Card from '@/shared/components/Card';
import TagCalendar from '@/study-record-stats/components/TagCalendar';

export default function TagCalendarPreview() {
  return (
    <Card title={INTRO_TAG}>
      <PreviewSubTitle>{INTRO_TEXT.tagCalendarSubTitle}</PreviewSubTitle>
      <TagCalendar calendar={CALENDAR} />
    </Card>
  );
}

const CALENDAR = getTagCalendar({month: INTRO_MONTH, records: INTRO_RECORDS, tag: INTRO_TAG});
