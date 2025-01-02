'use client';

import React, {useCallback} from 'react';
import {toast} from 'react-toastify';
import styles from './index.module.scss';
import {useToggle} from '@/utils/extend/library/react';
import classNames from 'classnames';

interface KeywordListItemProp {
  keyword: string;
  removeKeyword: (keyword: string) => void
  editKeyword: (prevKeyword: string, newKeyword: string) => void
  addKeyword: (keyword: string, leftKeyword?: string) => void
  isFirstItem: boolean;
}

export default function KeywordListItem({keyword, removeKeyword, editKeyword, addKeyword, isFirstItem}: KeywordListItemProp) {
  const {bool: isKeywordHidden, setFalse: showKeyword} = useToggle(!isFirstItem);

  const onClickDeleteButton = useCallback(() => {
    removeKeyword(keyword);
  }, [keyword, removeKeyword]);

  const onEdit = useCallback(() => {
    const newKeyword = window.prompt('Edit keyword');

    if (!newKeyword) {
      return;
    }

    editKeyword(keyword, newKeyword);
    toast.info('수정되었습니다.');
  }, [editKeyword, keyword]);

  const onClickAddButton = useCallback(() => {
    const newKeyword = window.prompt('Enter keyword');

    if (newKeyword) {
      addKeyword(newKeyword, keyword);
    }
  }, [addKeyword, keyword]);

  return (
    <div className={classNames(styles.wrap, {hidden: isKeywordHidden})}>
      <div className={styles.keyword} onClick={onEdit}>{keyword}</div>
      <button className={styles.deleteButton} onClick={onClickDeleteButton}>X</button>
      <button className={styles.addButton} onClick={onClickAddButton}>+</button>
      {!isKeywordHidden ? null : (
        <button className={styles.hiddenBox} onClick={showKeyword}>
          Check!
        </button>
      )}
    </div>
  );
}
