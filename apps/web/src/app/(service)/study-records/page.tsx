import {redirect} from 'next/navigation';
import {getKoreanDate} from '@plan-for-myself/shared/date';
import {monthPath} from '@plan-for-myself/shared/study-record';

export default function Page() {
  const {year, month: monthIndex} = getKoreanDate();
  redirect(monthPath({year, month: monthIndex + 1}));
}
