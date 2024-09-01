import styles from '@/styles/typography.module.scss';
import {CSSProperties, PropsWithChildren} from 'react';
import classNames from 'classnames';

export interface TypographyProps {
  bold?: boolean;
  style?: CSSProperties;
  className?: string;
}

export function H1({bold = true, className, ...rest}: PropsWithChildren<TypographyProps>) {
  return <h1 className={classNames(className, {[styles.bold]: bold}, styles.h1)} {...rest}/>
}

export function H2({bold = true, className, ...rest}: PropsWithChildren<TypographyProps>) {
  return <h2 className={classNames(className, {[styles.bold]: bold}, styles.h2)} {...rest}/>
}

export function Body1({bold = false, className, ...rest}: PropsWithChildren<TypographyProps>) {
  return <span className={classNames(className, {[styles.bold]: bold}, styles.body1)} {...rest}/>
}

export function Body2({bold = false, className, ...rest}: PropsWithChildren<TypographyProps>) {
  return <span className={classNames(className, {[styles.bold]: bold}, styles.body2)} {...rest}/>
}
