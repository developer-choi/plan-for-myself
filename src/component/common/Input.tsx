import {ComponentPropsWithoutRef, forwardRef, Ref} from 'react';
import classNames from 'classnames';
import styles from './input.module.scss';

export const Input =  forwardRef(function Input({className, ...rest}: ComponentPropsWithoutRef<'input'>, ref: Ref<HTMLInputElement>) {
  return (
    <input ref={ref} className={classNames(styles.input, className)} {...rest}/>
  );
});

export const TextArea = forwardRef(function TextArea({className, ...rest}: ComponentPropsWithoutRef<'textarea'>, ref: Ref<HTMLTextAreaElement>) {
  return (
    <textarea ref={ref} className={classNames(styles.textarea, className)} {...rest}/>
  );
});
