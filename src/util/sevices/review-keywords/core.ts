import type {ParsedUrlQuery} from 'querystring';
import {KEYWORD_SEPARATOR} from '@/util/sevices/review-keywords/hooks';

export const KEYWORD_KEY = 'keywords-v3';

export function convertLegacyKeywordIfLegacy(query: ParsedUrlQuery): string {
  const v1LegacyKeywords = query[LEGACY_KEYWORD_KEY.v1];
  const v2LegacyKeywords = query[LEGACY_KEYWORD_KEY.v2];

  // v1과 v3 형태가 같음. v2만 다름. v3에서 다시 v1로 타입 돌아가려고함.
  if (v1LegacyKeywords) {
    if (typeof v1LegacyKeywords !== 'string') {
      return '';
    }

    return encodeURIComponent(v1LegacyKeywords);
  }

  if (v2LegacyKeywords) {
    if (typeof v2LegacyKeywords !== 'string') {
      return '';
    }

    try {
      const result = JSON.parse(decodeURIComponent(v2LegacyKeywords)) as {
        value: string;
        children: {value: string}[];
      }[];

      return result
        .reduce((a, b) => a.concat(b.value).concat(b.children.map(({value}) => value)), [] as string[])
        // 이걸 꼭 해줘야 입력값에 한글있어도 됨.
        .map(value => encodeURIComponent(value))
        .join(KEYWORD_SEPARATOR);
    } catch (error) {
      console.error(error)
      return '';
    }
  }

  return '';
}

/*************************************************************************************************************
 * Non Export
 *************************************************************************************************************/
const LEGACY_KEYWORD_KEY = {
  v1: 'keywords',
  v2: 'keywords-v2'
};
