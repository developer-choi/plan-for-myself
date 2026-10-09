'use client';

import CalendarGrid from '@/study-record/components/CalendarGrid';
import {INTRO_CALENDAR_MONTH, INTRO_CALENDAR_RECORDS, INTRO_CALENDAR_TODAY} from '@/intro/intro-examples';

export default function CalendarPreview() {
  return (
    <CalendarGrid
      handlers={PREVIEW_HANDLERS}
      month={INTRO_CALENDAR_MONTH}
      records={INTRO_CALENDAR_RECORDS}
      today={INTRO_CALENDAR_TODAY}
    />
  );
}

const PREVIEW_HANDLERS = {
  onFutureDateClick: () => {},
  onRecordableDateClick: () => {},
};
