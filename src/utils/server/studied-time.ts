export function convertStudiedTimeTimestamp(year: number, month: number, date: number) {
  return new Date(`${year}-${month}-${date} 13:00:00`).getTime();
}

export function dateFormatter(value: Date) {
  const year = String(value.getFullYear());
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const date = String(value.getDate()).padStart(2, '0');
  const hour = String(value.getHours()).padStart(2, '0');
  const minute = String(value.getMinutes()).padStart(2, '0');
  const second = String(value.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${date} ${hour}:${minute}:${second}`;
}
