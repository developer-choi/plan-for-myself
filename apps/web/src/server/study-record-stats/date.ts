export function addDays(date: string, amount: number) {
  const [year, month, day] = date.split('-').map(Number);
  return formatDate(Date.UTC(year, month - 1, day + amount));
}

export function toMonth(date: string) {
  return date.slice(0, MONTH_LENGTH);
}

export function addMonths(month: string, amount: number) {
  const [year, monthNumber] = month.split('-').map(Number);
  return formatDate(Date.UTC(year, monthNumber - 1 + amount, 1)).slice(0, MONTH_LENGTH);
}

export function listMonths(from: string, to: string) {
  const months: string[] = [];
  for (let month = from; month <= to; month = addMonths(month, 1)) {
    months.push(month);
  }
  return months;
}

const DATE_LENGTH = 'YYYY-MM-DD'.length;
const MONTH_LENGTH = 'YYYY-MM'.length;

function formatDate(time: number) {
  return new Date(time).toISOString().slice(0, DATE_LENGTH);
}
