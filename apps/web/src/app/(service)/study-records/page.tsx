import {redirect} from 'next/navigation';
import {getKoreanDate} from '@plan-for-myself/shared';
import {monthPath} from '@/study-record/calendar-date';

export default function Page() {
  const {year, month: monthIndex} = getKoreanDate();
  redirect(monthPath({year, month: monthIndex + 1}));
}
