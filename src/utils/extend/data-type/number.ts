export function numberWithComma(value: number | string): string {
  const _value = typeof value === 'string' ? value : value.toString();
  const parts = _value.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

export function calculateTotal<T>(list: T[], callback: (item: T) => number) {
  return list.reduce((a, b) => {
    return a + callback(b);
  }, 0);
}

export function getAbsoluteValueWithSign(value: number) {
  const absoluteValue = Math.abs(value);
  const signType = value >= 0 ? 'positive' : 'negative';

  return {
    absoluteValue,
    sign: signType === 'positive' ? '+' : '-',
    signType
  };
}
