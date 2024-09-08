import {ReactNode, PropsWithChildren, CSSProperties, ComponentPropsWithRef} from 'react';
import classNames from 'classnames';
import styles from './index.module.scss';

export interface FormElementWrapperProps {
  label?: string | ReactNode;
  error?: string;

  className?: string;
  style?: CSSProperties;
}

export function FormElementWrapper({label, error, children, style, className = ''}: PropsWithChildren<FormElementWrapperProps>) {
  return (
    <label style={style} className={classNames(styles.container, className)}>
      {!label ? null : <Label>{label}</Label>}

      {children}

      {!error ? null : <span className={styles.formErrorMessage}>{error}</span>}
    </label>
  )
}

export function Label({className, ...rest}: ComponentPropsWithRef<'span'>) {
  return (
    <span className={classNames(styles.label, className)} {...rest}/>
  );
}
