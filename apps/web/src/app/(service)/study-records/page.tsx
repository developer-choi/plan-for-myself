import {redirect} from 'next/navigation';
import {getKoreanDate, monthPath} from '@plan-for-myself/shared';

export default function Page() {
  const {year, month: monthIndex} = getKoreanDate();
  redirect(monthPath({year, month: monthIndex + 1}));
}
