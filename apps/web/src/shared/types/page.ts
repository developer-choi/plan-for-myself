export interface SearchParamsPageProps {
  /* undefined: 주소에 해당 항목이 없는 경우 */
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}
