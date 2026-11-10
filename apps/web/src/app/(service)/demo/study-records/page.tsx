import {demoCalendarPath} from '@plan-for-myself/shared';
import {redirect} from 'next/navigation';
import {getDemoMonth} from '@/demo/demo-today';

export default function Page() {
  redirect(demoCalendarPath(getDemoMonth()));
}
