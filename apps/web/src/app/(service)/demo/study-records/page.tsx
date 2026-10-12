import {redirect} from 'next/navigation';
import {demoCalendarPath} from '@/demo/demo-path';
import {getDemoMonth} from '@/demo/demo-today';

export default function Page() {
  redirect(demoCalendarPath(getDemoMonth()));
}
