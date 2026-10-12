'use client';

import {useSuspenseQuery} from '@tanstack/react-query';
import {type CalendarMonth, toMonthParam} from '@/study-record/calendar-date';
import {studyRecordQueries} from '@/study-record/queries';
import TagCalendar from '@/study-record-stats/components/TagCalendar';
import {getTagCalendar} from '@/study-record-stats/tag-detail';

interface FetchedTagCalendarProps {
  month: CalendarMonth;
  tag: string;
}

export default function FetchedTagCalendar({month, tag}: FetchedTagCalendarProps) {
  const {data: records} = useSuspenseQuery(studyRecordQueries.list.options(toMonthParam(month)));

  return <TagCalendar calendar={getTagCalendar({month, records, tag})} />;
}
