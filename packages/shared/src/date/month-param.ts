export function toDateMonthParam(date: string): string {
  return date.slice(0, MONTH_PARAM_LENGTH);
}

const MONTH_PARAM_LENGTH = 'YYYY-MM'.length;
