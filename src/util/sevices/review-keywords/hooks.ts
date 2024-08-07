'use client';

import {useCallback, useEffect, useState} from 'react';
import {toast} from 'react-toastify';
import {ReadonlyURLSearchParams, useRouter, useSearchParams} from 'next/navigation';
import {KEYWORD_KEY} from '@/util/sevices/review-keywords/core';

/*************************************************************************************************************
 * Exported functions
 *************************************************************************************************************/
export function useHandleKeywordList() {
  const {replace} = useRouter();
  const searchParams = useSearchParams();

  const [keywords, setKeywords] = useState(parseKeywords(searchParams));

  useEffect(() => {
    replace(`?${KEYWORD_KEY}=${stringifyKeywords(keywords)}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keywords]);

  const addKeyword = useCallback((keyword: string, leftKeyword?: string) => {
    if (keyword.includes(KEYWORD_SEPARATOR)) {
      toast.error(`키워드에 ${KEYWORD_SEPARATOR}는 허용되지 않습니다. 다른 특수문자를 사용해주세요.`);
      return;
    }

    setKeywords(prevState => {
      if (prevState.find((prevKeyword) => keyword === prevKeyword)) {
        toast.error(`${keyword}는 이미 존재합니다.`);
        return prevState;
      }

      if (!leftKeyword) {
        return prevState.concat(keyword);
      }

      return prevState.reduce((a, b) => {
        if (b !== leftKeyword) {
          return a.concat(b);

        } else {
          return a.concat(b, keyword);
        }
      }, [] as string[]);
    });
  }, []);

  const removeKeyword = useCallback((keyword: string) => {
    setKeywords(prevState => prevState.filter(value => value != keyword));
  }, []);

  const resetKeyword = useCallback(() => {
    if (confirm('초기화 하시겠습니까?')) {
      setKeywords([]);
    }
  }, []);

  const shareKeywords = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(`${location.origin}/tool/review-keywords?${KEYWORD_KEY}=${stringifyKeywords(keywords)}`);
      toast.info('복사되었습니다.');
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    }

  }, [keywords]);

  const editKeyword = useCallback((prevKeyword: string, newKeyword: string) => {
    setKeywords(prevState => prevState.map(prev => {
      if (prev !== prevKeyword) {
        return prev;
      } else {
        return newKeyword
      }
    }));
  }, []);

  return {
    keywords,
    addKeyword,
    removeKeyword,
    resetKeyword,
    shareKeywords,
    editKeyword,
  };
}

/*************************************************************************************************************
 * Non Export
 *************************************************************************************************************/
export const KEYWORD_SEPARATOR = '_';

function parseKeywords(searchParams: ReadonlyURLSearchParams): string[] {
  const keywords = searchParams.get(KEYWORD_KEY);

  if (!keywords) {
    return [];
  }

  return keywords.split(KEYWORD_SEPARATOR);
}

function stringifyKeywords(keywords: string[]) {
  return keywords.join(KEYWORD_SEPARATOR);
}
