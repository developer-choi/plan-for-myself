// 단위 : minutes
export function studiedTimeFormat(value: number) {
  const hours = Math.floor(value / 60);
  const minutes = Math.floor(value % 60).toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}
