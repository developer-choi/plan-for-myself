'use client';

import React, {ChangeEvent, FormEvent, useCallback, useEffect, useRef, useState} from 'react';
import styles from './index.module.scss';
import Input from '@/component/design-system/form/Input';
import Button from '@/component/design-system/element/Button';

export interface KeywordFormProp {
  addKeyword: (keyword: string) => void
  resetKeyword: () => void
  shareKeywords: () => void
}

export default function KeywordForm({addKeyword, resetKeyword, shareKeywords}: KeywordFormProp) {
  const [value, setValue] = useState('');

  const onChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  }, []);

  const add = useCallback(() => {
    if (!value) {
      return;
    }

    addKeyword(value.trim());
    setValue('');
  }, [addKeyword, value]);

  const handleSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  }, []);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handler() {
      inputRef.current?.focus();
    }

    window.addEventListener('focus', handler);

    return () => {
      window.removeEventListener('focus', handler);
    };
  }, []);

  return (
    <form className={styles.wrap} onSubmit={handleSubmit}>
      <Input ref={inputRef} autoFocus value={value} onChange={onChange}/>
      <Button type="submit" className={styles.customButton} onClick={add}>추가</Button>
      <Button className={styles.customButton} onClick={resetKeyword}>리셋</Button>
      <Button className={styles.customButton} onClick={shareKeywords}>공유</Button>
    </form>
  );
}
