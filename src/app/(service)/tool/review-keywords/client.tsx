'use client';

import {useHandleKeywordList} from '@/utils/service/review-keywords/hooks';
import {KeyboardShortcut, useKeyboardShortcut} from '@/utils/extend/event/keyboard';
import styles from '@/app/(service)/tool/review-keywords/page.module.scss';
import KeywordForm from '@/components/service/review-keywords/KeywordForm';
import KeywordListItem from '@/components/service/review-keywords/KeywordListItem';
import React from 'react';

export default function ReviewKeywordsPage() {
  const {keywords, removeKeyword, addKeyword, resetKeyword, shareKeywords, editKeyword} = useHandleKeywordList();

  useKeyboardShortcut(DELETE_KEYBOARD, resetKeyword);

  return (
    <div className={styles.pageWrap}>
      <KeywordForm addKeyword={addKeyword} resetKeyword={resetKeyword} shareKeywords={shareKeywords}/>

      <div className={styles.listWrap}>
        {keywords.map((keyword, index) => (
          <KeywordListItem
            key={keyword}
            keyword={keyword}
            removeKeyword={removeKeyword}
            editKeyword={editKeyword}
            addKeyword={addKeyword}
            isFirstItem={index === 0}
          />
        ))}
      </div>
    </div>
  )
}

const DELETE_KEYBOARD: KeyboardShortcut = {
  key: 'delete'
};
