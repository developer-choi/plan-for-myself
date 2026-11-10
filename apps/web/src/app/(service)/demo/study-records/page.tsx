import {demoCalendarPath, getDemoMonth} from '@plan-for-myself/shared/demo';
import {redirect} from 'next/navigation';

export default function Page() {
  redirect(demoCalendarPath(getDemoMonth()));
}
