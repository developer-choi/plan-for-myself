import type {CalendarMonth} from '@/study-record/calendar-date';

export const DEMO_TODAY = '2026-09-30';

// eslint-disable-next-line no-magic-numbers -- 'YYYY-MM-DD'에서 연·월을 잘라 내는 위치라 숫자를 그대로 적는다
export const DEMO_MONTH: CalendarMonth = {year: Number(DEMO_TODAY.slice(0, 4)), month: Number(DEMO_TODAY.slice(5, 7))};
