import {ReactNode, PropsWithChildren, CSSProperties} from "react";
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
    <div style={style} className={classNames(className)}>
      {!label ? null : <label className={styles.label}>{label}</label>}

      {children}

      {!error ? null : <span className={styles.formErrorMessage}>{error}</span>}
    </div>
  )
}
