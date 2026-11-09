import {type CalendarMonth, toMonthParam} from '@plan-for-myself/shared/date';
import {getTagCalendar} from '@plan-for-myself/shared/study-record-stats';
import {useSuspenseQuery} from '@tanstack/react-query';
import {studyRecordQueries} from '@/study-record/queries';
import TagCalendar from '@/study-record-stats/components/TagCalendar';

interface FetchedTagCalendarProps {
  month: CalendarMonth;
  tag: string;
}

export default function FetchedTagCalendar({month, tag}: FetchedTagCalendarProps) {
  const {data: records} = useSuspenseQuery(studyRecordQueries.list.options(toMonthParam(month)));

  return <TagCalendar calendar={getTagCalendar({month, records, tag})} />;
}
