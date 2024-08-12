export function numberWithComma(value: number | string): string {
  const _value = typeof value === 'string' ? value : value.toString();
  const parts = _value.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}
